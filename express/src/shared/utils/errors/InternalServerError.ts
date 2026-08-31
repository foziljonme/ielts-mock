import { AppError } from "./AppError";
import { ErrorCodes } from "./codes";

export class InteralServerError extends AppError {
  constructor(message: string) {
    super("Internal Error", 500, ErrorCodes.INTERNAL_ERROR, message);
  }
}
