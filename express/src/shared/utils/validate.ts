// src/lib/api/validate.ts
import { ZodType, ZodError, treeifyError } from "zod";
import { ValidationError } from "./errors";

export function validate<T>(
  schema: ZodType<T>,
  data: unknown,
  allowEmpty = false,
): T {
  try {
    const result = schema.parse(data);
    if (!allowEmpty && Object.keys(result as any).length === 0) {
      throw new ValidationError("Please provide valid non-empty data");
    }
    return result;
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError(treeifyError(err));
    }
    throw err;
  }
}
