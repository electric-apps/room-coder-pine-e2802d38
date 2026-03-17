import { describe, it, expect } from "vitest";
import { todoInsertSchema, todoSelectSchema } from "@/db/zod-schemas";
import { generateValidRow, parseDates } from "./helpers/schema-test-utils";

describe("todo collection insert validation", () => {
	it("validates a complete insert row", () => {
		const row = generateValidRow(todoInsertSchema);
		const result = todoInsertSchema.safeParse(row);
		expect(result.success).toBe(true);
	});

	it("validates a minimal insert row (only required fields)", () => {
		const row = { id: crypto.randomUUID(), title: "Buy groceries", completed: false };
		const result = todoInsertSchema.safeParse(row);
		expect(result.success).toBe(true);
	});

	it("allows an insert row with empty title (text().notNull() permits empty string)", () => {
		const row = { id: crypto.randomUUID(), title: "", completed: false };
		const result = todoInsertSchema.safeParse(row);
		// text().notNull() only blocks null, not empty string
		expect(result.success).toBe(true);
	});
});

describe("JSON round-trip", () => {
	it("parseDates restores Date objects after JSON serialization", () => {
		const row = generateValidRow(todoSelectSchema);
		const serialized = JSON.parse(JSON.stringify(row));
		const parsed = parseDates(serialized);
		expect(parsed.created_at).toBeInstanceOf(Date);
		expect(parsed.updated_at).toBeInstanceOf(Date);
	});

	it("todoSelectSchema accepts parseDates output", () => {
		const row = generateValidRow(todoSelectSchema);
		const roundTripped = parseDates(JSON.parse(JSON.stringify(row)));
		const result = todoSelectSchema.safeParse(roundTripped);
		expect(result.success).toBe(true);
	});
});
