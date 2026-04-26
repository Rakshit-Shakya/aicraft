import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {prisma} from "@/lib/db";
import { inngest } from "@/inngest/client";
import z from "zod";
import { TRPCError } from "@trpc/server";

export const messageRouter = createTRPCRouter({
    getMany: protectedProcedure
    .input(
        z.object({
            
            projectId: z.string().min(1, {message: "project ID is required"}),
        }),
    )
    .query(async ({input, ctx}) => {
        const messages = await prisma.message.findMany({
            where: {
                projectId: input.projectId,
                project: {
                    userId: ctx.userId,
                },
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
    create: protectedProcedure
    .input(
        z.object({
            value: z.string().min(1, {message: "Prompt is required"})
            .max(10000, {message: "Prompt is too long"}),
            projectId: z.string().min(1, {message: "project ID is required"}),
        }),
    )
    
    .mutation(async ({input, ctx}) => {
        const existingProject = await prisma.project.findUnique({
            where: {
                id: input.projectId,
                userId: ctx.userId,
            },
        });
        if (!existingProject){
            throw new TRPCError({ code: "NOT_FOUND", message: "Project not found"});
        }
 
        const createdMessage = await prisma.message.create({
            data: {
                projectId: existingProject.id,
                content: `Generated fragment based on the user's prompt: "${input.value}"`,
                role: "USER",
                type: "RESULT",
            },
        });

        await inngest.send({
              name: "code-agent/run",
              data: {
                value : input.value,
                projectId: existingProject.id,
              },
            });
            
            return createdMessage;
    }),
});
