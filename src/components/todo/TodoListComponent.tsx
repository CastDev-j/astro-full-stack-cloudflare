import { actions } from "astro:actions";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { formatDate } from "@/lib/format-date";
import { navigate } from "astro:transitions/client";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface Props {
  initialTodos: Todo[];
  totalCount: number;
  page: number;
}

export default function TodoListComponent({
  initialTodos,
  totalCount: initialTotal,
  page,
}: Props) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [total, setTotal] = useState(initialTotal);
  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;

    setAdding(true);
    const { data } = await actions.todo.upsertTodo({ title });
    setAdding(false);

    if (!data?.success || !data.data) return;

    const created = data.data as Todo;
    setTodos((prev) => [created, ...prev].splice(0, 5));
    setTotal((prev) => prev + 1);
    setInput("");

    if (page !== 1) {
      await navigate("?page=1");
    }
  }

  async function handleDelete(id: string) {
    const { data } = await actions.todo.deleteTodo({ id });
    if (!data?.success) return;

    setTodos((prev) => prev.filter((t) => t.id !== id));
    setTotal((prev) => prev - 1);
  }

  async function handleToggle(todo: Todo) {
    const { data } = await actions.todo.upsertTodo({
      id: todo.id,
      title: todo.title,
      completed: !todo.completed,
      createdAt: todo.createdAt,
    });
    if (!data?.success) return;

    if (page !== 1) {
      await navigate("?page=1");
    }

    setTodos((prev) =>
      prev.map((t) =>
        t.id === todo.id
          ? { ...t, completed: !t.completed, updatedAt: new Date() }
          : t,
      ),
    );
  }

  return (
    <ul className="mt-4 flex flex-col gap-2">
      <li>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nueva tarea..."
            className="flex-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
            required
            minLength={1}
          />
          <button
            type="submit"
            disabled={adding}
            className="shrink-0 rounded-lg bg-neutral-800 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
          >
            Agregar
          </button>
        </form>
      </li>

      {todos.map((todo) => (
        <li
          key={todo.id}
          className="rounded-lg border border-neutral-200 bg-white px-4 py-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button
                onClick={() => handleToggle(todo)}
                className={`size-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors text-xs ${
                  todo.completed
                    ? "border-neutral-800 bg-neutral-800 text-white"
                    : "border-neutral-300 hover:border-neutral-400"
                }`}
              >
                {todo.completed && <FaCheck />}
              </button>

              <span
                className={`truncate text-sm font-medium ${
                  todo.completed
                    ? "text-neutral-400 line-through"
                    : "text-neutral-900"
                }`}
              >
                {todo.title}
              </span>
            </div>

            <div className="flex gap-2">
              <span
                className={`shrink-0 rounded-full px-3 py-0.5 text-xs font-medium ${
                  todo.completed
                    ? "bg-neutral-800 text-white"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {todo.completed ? "completado" : "pendiente"}
              </span>

              <button
                onClick={() => handleDelete(todo.id)}
                className="shrink-0 rounded-full bg-red-100 px-3 py-0.5 text-xs font-medium text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                Eliminar
              </button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-4 border-t border-neutral-100 pt-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">
                createdAt
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">
                {formatDate(todo.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">
                updatedAt
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">
                {formatDate(todo.updatedAt)}
              </p>
            </div>
          </div>
        </li>
      ))}

      {todos.length > 0 && (
        <li className="bg-white px-4 py-3 flex items-center justify-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => navigate(`?page=${page - 1}`)}
            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>

          <p className="text-sm text-neutral-500">
            Página {page} · {total} tareas
          </p>

          <button
            disabled={page * 5 >= total}
            onClick={() => navigate(`?page=${page + 1}`)}
            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Siguiente →
          </button>
        </li>
      )}

      {todos.length === 0 && (
        <li className="rounded-lg border border-neutral-200 bg-white px-4 py-3">
          <p className="text-center text-sm text-neutral-500">
            {page > 1 ? (
              <>
                No hay más tareas.{" "}
                <button
                  onClick={() => navigate(`?page=1`)}
                  className="underline underline-offset-2 hover:text-neutral-700 transition-colors"
                >
                  Volver al inicio
                </button>
              </>
            ) : (
              "No hay tareas por el momento"
            )}
          </p>
        </li>
      )}
    </ul>
  );
}
