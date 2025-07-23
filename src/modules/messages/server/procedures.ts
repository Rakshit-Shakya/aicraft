import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import {prisma} from "@/lib/db";
import { inngest } from "@/inngest/client";
import z from "zod";

export const messageRouter = createTRPCRouter({
    getMany: baseProcedure
    .input(
        z.object({
            
            projectId: z.string().min(1, {message: "project ID is required"}),
        }),
    )
    .query(async ({input}) => {
        const messages = await prisma.message.findMany({
            where: {
                projectId: input.projectId,
            },
            include: {
                fragment: true,
            },
            orderBy: {
                updatedAt: "asc",
            },
        });
        return messages;
    }),
    create: baseProcedure
    .input(
        z.object({
            value: z.string().min(1, {message: "Prompt is required"})
            .max(10000, {message: "Prompt is too long"}),
            projectId: z.string().min(1, {message: "project ID is required"}),
        }),
    )
    
    .mutation(async ({input}) => {
        const createdMessage = await prisma.message.create({
            data: {
                projectId: input.projectId,
                content: `Generated fragment based on the user's prompt: "${input.value}"`,
                role: "USER",
                type: "RESULT",
            },
        });

        await inngest.send({
              name: "code-agent/run",
              data: {
                value : input.value,
                projectId: input.projectId,
              },
            });
            
            return createdMessage;
    }),
});
