import { AppError } from "./AppError";
import { ErrorCodes } from "./codes";

export class BadRequest extends AppError {
  constructor(message: string, details?: string) {
    super(message, 400, ErrorCodes.BAD_REQUEST, details || "Bad Request");
  }
}
