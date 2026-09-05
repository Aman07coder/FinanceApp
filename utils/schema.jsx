import { integer, pgTable, serial, varchar , numeric } from "drizzle-orm/pg-core";

export const Budgets = pgTable("budgets", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    amount: varchar("amount", { length: 20 }).notNull(),
    icon: varchar("icon", { length: 255 }),
    createdBy: varchar("createdBy", { length: 255 }).notNull(),
});

export const Expenses=pgTable('expenses',{
    id:serial('id').primaryKey(),
    name:varchar('name').notNull(), 
    amount:numeric('amount').notNull().default(0),
    budgetId:integer('budgetId').references(()=>Budgets.id),
    createdAt:varchar('createdAt').notNull()
})
