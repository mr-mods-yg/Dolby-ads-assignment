import z from "zod";

const folderSchema = z.object({
  folderName: z
    .string({ required_error: "Folder name is required" })
    .min(1, { message: "Folder must be at least 1 characters long" })
    .max(40, { message: "Username must be at most 40 characters long" }),
  isRoot: z
    .boolean({ required_error: "Is Root is required" })
});

export { folderSchema };
