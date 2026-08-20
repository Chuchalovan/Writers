import {
  AppError,
  ERROR_CODES,
  ERROR_HTTP_STATUS,
  toErrorEnvelope,
  type ErrorCode,
  type ErrorEnvelope,
} from "@manuscript/shared";

export { AppError, ERROR_CODES, toErrorEnvelope, ERROR_HTTP_STATUS };
export type { ErrorCode, ErrorEnvelope };

type ZodLikeError = {
  issues: Array<{ path: Array<string | number>; message: string }>;
};

export function validationError(error: ZodLikeError): AppError {
  return new AppError(
    ERROR_CODES.VALIDATION_ERROR,
    error.issues[0]?.message ?? "Invalid input",
    error.issues.map((issue) => ({
      path: issue.path,
      message: issue.message,
    }))
  );
}

export function errorResponse(error: unknown): Response {
  const appError =
    error instanceof AppError
      ? error
      : new AppError(ERROR_CODES.VALIDATION_ERROR, "Unexpected error");
  return Response.json(appError.toEnvelope(), { status: appError.httpStatus });
}

export type ActionFailure = ErrorEnvelope;
export type ActionResult<T> = T | ActionFailure;

export function isActionFailure(value: unknown): value is ActionFailure {
  return Boolean(value && typeof value === "object" && "error" in value);
}
