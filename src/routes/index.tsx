import {
	Badge,
	Button,
	Card,
	Checkbox,
	Container,
	Flex,
	Heading,
	IconButton,
	Separator,
	Spinner,
	Text,
	TextField,
} from "@radix-ui/themes";
import { eq, not, useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { CheckSquare, Plus, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { todosCollection } from "@/db/collections/todos";

export const Route = createFileRoute("/")({
	ssr: false,
	loader: async () => {
		await todosCollection.preload();
		return null;
	},
	component: TodoPage,
});

function TodoPage() {
	const [newTitle, setNewTitle] = useState("");

	const { data: todos, isLoading } = useLiveQuery((q) =>
		q
			.from({ todo: todosCollection })
			.orderBy(({ todo }) => todo.created_at, "desc"),
	);

	const { data: pendingTodos } = useLiveQuery((q) =>
		q
			.from({ todo: todosCollection })
			.where(({ todo }) => not(eq(todo.completed, true))),
	);

	const handleAdd = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			const title = newTitle.trim();
			if (!title) return;
			todosCollection.insert({
				id: crypto.randomUUID(),
				title,
				completed: false,
				created_at: new Date(),
				updated_at: new Date(),
			});
			setNewTitle("");
		},
		[newTitle],
	);

	const handleToggle = useCallback((id: string) => {
		todosCollection.update(id, (draft) => {
			draft.completed = !draft.completed;
		});
	}, []);

	const handleDelete = useCallback((id: string) => {
		todosCollection.delete(id);
	}, []);

	const pendingCount = pendingTodos?.length ?? 0;

	return (
		<Container size="2" py="6">
			<Flex direction="column" gap="5">
				<Flex justify="between" align="center">
					<Flex direction="column" gap="1">
						<Heading size="7">My Todos</Heading>
						<Text size="2" color="gray">
							{isLoading
								? "Loading…"
								: `${pendingCount} task${pendingCount !== 1 ? "s" : ""} remaining`}
						</Text>
					</Flex>
					{!isLoading && todos && todos.length > 0 && (
						<Badge
							color={pendingCount === 0 ? "green" : "orange"}
							variant="soft"
							size="2"
						>
							{pendingCount === 0 ? "All done!" : `${pendingCount} pending`}
						</Badge>
					)}
				</Flex>

				<form onSubmit={handleAdd}>
					<Flex gap="2">
						<TextField.Root
							placeholder="Add a new task…"
							value={newTitle}
							onChange={(e) => setNewTitle(e.target.value)}
							style={{ flex: 1 }}
							size="3"
						/>
						<Button type="submit" size="3" disabled={!newTitle.trim()}>
							<Plus size={16} />
							Add
						</Button>
					</Flex>
				</form>

				{isLoading ? (
					<Flex align="center" justify="center" py="9">
						<Spinner size="3" />
					</Flex>
				) : todos && todos.length === 0 ? (
					<Flex direction="column" align="center" gap="3" py="9">
						<CheckSquare size={48} strokeWidth={1} color="var(--gray-8)" />
						<Text size="4" color="gray">
							No tasks yet
						</Text>
						<Text size="2" color="gray">
							Add your first task above to get started
						</Text>
					</Flex>
				) : (
					<Card variant="surface">
						<Flex direction="column">
							{todos?.map((todo, index) => (
								<div key={todo.id}>
									{index > 0 && <Separator size="4" />}
									<Flex
										align="center"
										gap="3"
										px="2"
										py="3"
										style={{
											opacity: todo.completed ? 0.5 : 1,
											transition: "opacity 0.15s",
										}}
									>
										<Checkbox
											size="2"
											checked={todo.completed}
											onCheckedChange={() => handleToggle(todo.id)}
										/>
										<Text
											size="3"
											weight={todo.completed ? "regular" : "medium"}
											style={{
												flex: 1,
												textDecoration: todo.completed
													? "line-through"
													: "none",
											}}
										>
											{todo.title}
										</Text>
										<IconButton
											size="1"
											variant="ghost"
											color="red"
											onClick={() => handleDelete(todo.id)}
											aria-label="Delete task"
										>
											<Trash2 size={14} />
										</IconButton>
									</Flex>
								</div>
							))}
						</Flex>
					</Card>
				)}
			</Flex>
		</Container>
	);
}
