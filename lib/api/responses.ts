import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError, ValidationError } from "./errors";

/**
 * Standard success response
 */
export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Standard error response
 */
export function errorResponse(
  error: unknown,
  defaultMessage: string = "An error occurred"
) {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      },
      { status: 400 }
    );
  }

  // Handle custom API errors
  if (error instanceof ApiError) {
    const response: {
      error: string;
      details?: unknown;
    } = {
      error: error.message,
    };

    if (error.details && process.env.NODE_ENV === "development") {
      response.details = error.details;
    }

    return NextResponse.json(response, { status: error.statusCode });
  }

  // Handle generic errors
  console.error("[API Error]", defaultMessage, error);

  const response: {
    error: string;
    details?: string;
  } = {
    error: defaultMessage,
  };

  if (process.env.NODE_ENV === "development" && error instanceof Error) {
    response.details = error.message;
  }

  return NextResponse.json(response, { status: 500 });
}

/**
 * Wrap async API handler with error handling
 */
export function withErrorHandling<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>,
  defaultErrorMessage?: string
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return errorResponse(error, defaultErrorMessage);
    }
  };
}
