import { AppError } from "./AppError";
import { ErrorCodes } from "./codes";

export class NotFoundError extends AppError {
  constructor(message: string, details?: string) {
    super(message, 404, ErrorCodes.NOT_FOUND, details || "Not Found");
  }
}
