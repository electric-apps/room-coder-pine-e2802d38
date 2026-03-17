import { describe, it, expect } from "vitest"
import { todoSelectSchema, todoInsertSchema } from "@/db/zod-schemas"
import { generateValidRow, generateRowWithout, parseDates } from "./helpers/schema-test-utils"

describe("todoSelectSchema", () => {
	it("validates a valid row", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("rejects a row missing id", () => {
		const row = generateRowWithout(todoSelectSchema, "id")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("rejects a row missing title", () => {
		const row = generateRowWithout(todoSelectSchema, "title")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("coerces string dates to Date objects", () => {
		const row = generateValidRow(todoSelectSchema)
		const withStringDates = {
			...row,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		}
		const result = todoSelectSchema.safeParse(withStringDates)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.created_at).toBeInstanceOf(Date)
			expect(result.data.updated_at).toBeInstanceOf(Date)
		}
	})
})

describe("todoInsertSchema", () => {
	it("validates a valid insert row", () => {
		const row = generateValidRow(todoInsertSchema)
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("rejects a row missing title", () => {
		const row = generateRowWithout(todoInsertSchema, "title")
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("allows timestamps to be omitted", () => {
		const row = { id: crypto.randomUUID(), title: "Test todo", completed: false }
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})
})

describe("parseDates", () => {
	it("converts ISO date strings back to Date objects", () => {
		const row = generateValidRow(todoSelectSchema)
		const serialized = JSON.parse(JSON.stringify(row))
		const parsed = parseDates(serialized)
		expect(parsed.created_at).toBeInstanceOf(Date)
		expect(parsed.updated_at).toBeInstanceOf(Date)
	})
})
