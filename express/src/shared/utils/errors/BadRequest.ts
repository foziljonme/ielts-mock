import { AppError } from "./AppError";
import { ErrorCodes } from "./codes";

export class BadRequest extends AppError {
  constructor(message: string) {
    super("Bad request", 400, ErrorCodes.BAD_REQUEST, message);
  }
}
