import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { todos } from "./schema";

const dateField = z
	.union([z.string(), z.date()])
	.transform((val) => (typeof val === "string" ? new Date(val) : val));

export const todoSelectSchema = createSelectSchema(todos, {
	created_at: dateField,
	updated_at: dateField,
});

export const todoInsertSchema = createInsertSchema(todos, {
	created_at: dateField.optional(),
	updated_at: dateField.optional(),
});

export type Todo = z.infer<typeof todoSelectSchema>;
export type NewTodo = z.infer<typeof todoInsertSchema>;
