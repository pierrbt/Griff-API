import { z } from "zod";

const userIdParameter = z.coerce
  .number()
  .positive("User id must be positive")
  .int();

const createUserObject = z.object({
  pseudo: z.string().min(3, "Pseudo must be at least 3 characters long"),
  firstName: z.string().min(3, "First name must be at least 3 characters long"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const updateUserObject = z
  .object({
    pseudo: z.string().min(3, "Pseudo must be at least 3 characters long"),
    firstName: z
      .string()
      .min(3, "First name must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one parameter is required",
  });

export { userIdParameter, createUserObject, updateUserObject };
