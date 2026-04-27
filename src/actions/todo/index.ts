import { db } from "@/db";
import { todo as todoSchema } from "@/db/schema";
import { and, count, desc, eq } from "drizzle-orm";
import { defineAction } from "astro:actions";
import { z } from "zod";

export const todo = {
  getTodos: defineAction({
    input: z.object({
      page: z.number().default(1),
      offset: z.number().default(10),
    }),
    handler: async ({ offset, page }, context) => {
      const session = context.locals.session;
      if (!session) return { success: false, message: "Unauthorized" };

      const { id } = context.locals.user!;

      const [todos, allTodos] = await Promise.all([
        db
          .select()
          .from(todoSchema)
          .where(eq(todoSchema.userId, id))
          .orderBy(desc(todoSchema.updatedAt))
          .limit(offset)
          .offset((page - 1) * offset),
        db
          .select({ total: count() })
          .from(todoSchema)
          .where(eq(todoSchema.userId, id)),
      ]);

      return {
        success: true,
        data: todos,
        totalCount: allTodos[0]?.total ?? 0,
      };
    },
  }),

  upsertTodo: defineAction({
    input: z.object({
      id: z.string().optional(),
      title: z.string(),
      completed: z.boolean().optional(),
      createdAt: z.coerce.date().optional(),
    }),
    handler: async ({ id, title, completed, createdAt }, context) => {
      const session = context.locals.session;

      if (!session) return { success: false, message: "Unauthorized" };

      const { id: userId } = context.locals.user!;

      const newTodo = {
        id: id ?? crypto.randomUUID(),
        userId,
        title,
        completed: id ? (completed ?? false) : false,
        createdAt: id ? (createdAt ?? new Date()) : new Date(),
        updatedAt: new Date(),
      } satisfies typeof todoSchema.$inferInsert;

      try {
        await db
          .insert(todoSchema)
          .values(newTodo)
          .onConflictDoUpdate({
            target: todoSchema.id,
            set: {
              title: newTodo.title,
              completed: newTodo.completed,
              updatedAt: newTodo.updatedAt,
            },
          });

        return { success: true, data: newTodo };
      } catch (e) {
        return { success: false, message: "Failed to upsert todo" };
      }
    },
  }),

  deleteTodo: defineAction({
    input: z.object({
      id: z.string(),
    }),
    handler: async ({ id }, context) => {
      const session = context.locals.session;
      if (!session) return { success: false, message: "Unauthorized" };

      const { id: userId } = context.locals.user!;

      try {
        await db
          .delete(todoSchema)
          .where(and(eq(todoSchema.id, id), eq(todoSchema.userId, userId)));

        return { success: true };
      } catch (e) {
        return { success: false, message: "Failed to delete todo" };
      }
    },
  }),
};
