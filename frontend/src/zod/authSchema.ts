import z from "zod";
const usernameRegex = /^[a-z][a-z0-9_]+$/;
const signupSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(4, { message: "Username must be at least 4 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(usernameRegex, {
      message: "Username must start with a letter and can only contain lowercase letters, numbers, and underscores."
    }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" }),
  fullname: z
    .string({ required_error: "Full name is required" })
    .min(4, { message: "Full name must be at least 4 characters long" })
    .max(100, { message: "Full name must be at most 100 characters long" }),
});

const loginSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(4, { message: "Username must be at least 4 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(usernameRegex, {
      message: "Username must start with a letter and can only contain lowercase letters, numbers, and underscores."
    }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" }),
});

export { signupSchema, loginSchema };
