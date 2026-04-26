import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {prisma} from "@/lib/db";
import { inngest } from "@/inngest/client";
import z from "zod";
import { generateSlug } from "random-word-slugs";
import { Input } from "@/components/ui/input";
import { TRPCError } from "@trpc/server";

export const projectsRouter = createTRPCRouter({
    getOne: protectedProcedure
    .input(z.object({
        id: z.string().min(1,{message: "Id is required"}),
    }))
    .query(async ({input, ctx}) => {
        const existingProject = await prisma.project.findUnique({
            where: {
                id: input.id,
                userId: ctx.userId,
            },
        });

        if ( !existingProject){
            throw new TRPCError({ code: "NOT_FOUND", message: "Project not found"});
        }
        return existingProject;
    }),
    getMany: protectedProcedure
    .query(async ( { ctx}) => {
        const projects = await prisma.project.findMany({
            where: {
                userId: ctx.userId,
            },
            orderBy: {
                updatedAt: "asc",
            },
        });
        return projects;
    }),
    create: protectedProcedure
    .input(
        z.object({
            value: z.string()
            .min(1, {message: "Prompt is required"})
            .max(10000, {message: "Prompt is too long"}),
        }),
    )
    
    .mutation(async ({input, ctx}) => {
        const createdProject = await prisma.project.create({
            data: {
                userId: ctx.userId,
                name: generateSlug(2, {
                    format: "kebab",
                }),
                messages: {
                    create: {
                content: `Generated fragment based on the user's prompt: "${input.value}"`,
                role: "USER",
                type: "RESULT",
                    }
                }
            }
        })

        await inngest.send({
              name: "code-agent/run",
              data: {
                value : input.value,
                projectId: createdProject.id,
              },
            });
            
            return createdProject;
    }),
});
