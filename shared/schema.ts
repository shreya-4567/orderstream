import { sql } from "drizzle-orm";
import { pgTable, text, varchar, doublePrecision, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const orders = pgTable("orders", {
  orderId: varchar("order_id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  orderAmount: doublePrecision("order_amount").notNull(),
  orderDate: timestamp("order_date").notNull().defaultNow(),
  invoiceFileUrl: text("invoice_file_url"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  orderId: true,
  createdAt: true,
}).extend({
  orderAmount: z.coerce.number().min(0.01, "Order amount must be greater than 0"),
  customerName: z.string().min(1, "Customer name is required"),
  orderDate: z.string().optional(),
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Add users table (keeping existing structure)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
