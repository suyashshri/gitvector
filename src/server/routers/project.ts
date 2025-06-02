import { pollCommits } from "@/lib/github";
import prisma from "../db";
import { isAuthenticated } from "../middleware/auth";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const projectRouter = router({
  createProject: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        name: z.string().min(1, "Project name is required"),
        githubUrl: z.string().url("Invalid GitHub URL"),
        githubToken: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.userId;
      const project = await prisma.project.create({
        data: {
          name: input.name,
          githubUrl: input.githubUrl,
          userToProjects: {
            create: {
              userId: userId!,
            },
          },
        },
      });
      await pollCommits(project.id);
      return project;
    }),

  getProjects: publicProcedure.use(isAuthenticated).query(async ({ ctx }) => {
    const projects = await prisma.project.findMany({
      where: {
        userToProjects: {
          some: {
            userId: ctx.user.userId!,
          },
        },
        deleted: false,
      },
    });
    return projects;
  }),

  getCommits: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(async ({ input }) => {
      await pollCommits(input.projectId).then().catch(console.error);
      return await prisma.commit.findMany({
        where: { projectId: input.projectId },
      });
    }),
});
