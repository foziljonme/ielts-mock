import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4001),
  jwtSecret: process.env.JWT_SECRET as string,
};

if (!env.jwtSecret) {
  throw new Error("JWT_SECRET missing");
}
