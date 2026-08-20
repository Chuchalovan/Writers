export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  CONFLICT: "CONFLICT",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  EXPORT_FAILED: "EXPORT_FAILED",
  AI_KEY_MISSING: "AI_KEY_MISSING",
  AI_PROVIDER_ERROR: "AI_PROVIDER_ERROR",
  PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",
  RATE_LIMITED: "RATE_LIMITED",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export interface ErrorDetail {
  path?: Array<string | number>;
  message: string;
}

export interface ErrorEnvelope {
  error: {
    code: ErrorCode;
    message: string;
    details?: ErrorDetail[];
  };
}

export const ERROR_HTTP_STATUS: Record<ErrorCode, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 400,
  CONFLICT: 409,
  EMAIL_NOT_VERIFIED: 403,
  EXPORT_FAILED: 500,
  AI_KEY_MISSING: 400,
  AI_PROVIDER_ERROR: 502,
  PAYLOAD_TOO_LARGE: 413,
  RATE_LIMITED: 429,
};

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly details?: ErrorDetail[];

  constructor(code: ErrorCode, message: string, details?: ErrorDetail[]) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.details = details;
  }

  toEnvelope(): ErrorEnvelope {
    return toErrorEnvelope(this.code, this.message, this.details);
  }

  get httpStatus(): number {
    return ERROR_HTTP_STATUS[this.code];
  }
}

export function toErrorEnvelope(
  code: ErrorCode,
  message: string,
  details?: ErrorDetail[]
): ErrorEnvelope {
  return {
    error: {
      code,
      message,
      ...(details && details.length > 0 ? { details } : {}),
    },
  };
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function errorFromUnknown(error: unknown, fallbackMessage = "Unexpected error"): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof Error) {
    return new AppError(ERROR_CODES.VALIDATION_ERROR, error.message);
  }
  return new AppError(ERROR_CODES.VALIDATION_ERROR, fallbackMessage);
}
