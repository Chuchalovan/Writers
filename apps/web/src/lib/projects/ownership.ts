import { AppError, ERROR_CODES } from "@manuscript/shared";
import { db } from "@/lib/db";
import { project } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function assertProjectOwner(userId: string, projectId: string): Promise<void> {
  const row = await db.query.project.findFirst({
    where: eq(project.id, projectId),
    columns: { id: true, userId: true },
  });
  if (!row) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Project not found");
  }
  if (row.userId !== userId) {
    throw new AppError(ERROR_CODES.FORBIDDEN, "Forbidden");
  }
}
