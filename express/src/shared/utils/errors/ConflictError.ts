import { AppError } from "./AppError";
import { ErrorCodes } from "./codes";

export class ConflictError extends AppError {
  constructor(message: string) {
    super("Conflict error", 409, ErrorCodes.CONFLICT, message || "Conflict");
  }
}
