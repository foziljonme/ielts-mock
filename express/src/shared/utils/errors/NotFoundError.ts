import { AppError } from "./AppError";
import { ErrorCodes } from "./codes";

export class NotFoundError extends AppError {
  constructor(message: string) {
    super("Not Found", 404, ErrorCodes.NOT_FOUND, message || "Not Found");
  }
}
