import { toNextJsHandler } from "better-auth/next-js";
import { ERROR_CODES, isAppError } from "@manuscript/shared";
import { auth } from "@/lib/auth";
import {
  assertLoginAllowed,
  clientIpFromHeaders,
  recordLoginFailure,
  recordLoginSuccess,
} from "@/lib/auth/login-rate-limit";

const handlers = toNextJsHandler(auth);

export const GET = handlers.GET;

export async function POST(request: Request) {
  const url = new URL(request.url);
  const isSignIn = url.pathname.includes("/sign-in/email");
  if (!isSignIn) {
    return handlers.POST(request);
  }

  const ip = clientIpFromHeaders(request.headers);
  const clone = request.clone();
  const body = (await clone.json().catch(() => ({}))) as { email?: unknown };
  const email = typeof body.email === "string" ? body.email : "";

  try {
    assertLoginAllowed(ip, email);
  } catch (error) {
    if (isAppError(error)) {
      return Response.json(error.toEnvelope(), { status: error.httpStatus });
    }
    return Response.json(
      { error: { code: ERROR_CODES.RATE_LIMITED, message: "Too many login attempts." } },
      { status: 429 }
    );
  }

  const response = await handlers.POST(request);
  if (response.ok) {
    recordLoginSuccess(ip, email);
  } else if (response.status === 401 || response.status === 400 || response.status === 403) {
    recordLoginFailure(ip, email);
  }
  return response;
}
