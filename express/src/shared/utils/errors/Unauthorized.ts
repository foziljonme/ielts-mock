import { AppError } from "./AppError";
import { ErrorCodes } from "./codes";

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super("Unauthorized", 400, ErrorCodes.UNAUTHORIZED, message);
  }
}
