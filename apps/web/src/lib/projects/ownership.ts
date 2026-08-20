import { AppError, ERROR_CODES } from "@manuscript/shared";
import { prisma } from "@/lib/db";

export async function assertProjectOwner(userId: string, projectId: string): Promise<void> {
  const project = await prisma.project.findFirst({
    where: { id: projectId },
    select: { id: true, userId: true },
  });
  if (!project) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Project not found");
  }
  if (project.userId !== userId) {
    throw new AppError(ERROR_CODES.FORBIDDEN, "Forbidden");
  }
}
