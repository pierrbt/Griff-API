import { z } from "zod";

const gameIdParameter = z.coerce
  .number()
  .positive("Game id must be positive")
  .int();
const createGameObject = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long"),
  verticalIcon: z.string(),
  background: z.string(),
  altBackground: z.string(),
  installPath: z.string(),
  executable: z.string(),
  version: z.string(),
  size: z.number().positive("Size must be positive").int(),
});

export { gameIdParameter, createGameObject };
