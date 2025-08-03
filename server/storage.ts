import { type User, type InsertUser, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Order methods
  getOrder(orderId: string): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(orderId: string, status: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private orders: Map<string, Order>;

  constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    // Add some initial orders for demonstration
    const mockOrders: Order[] = [
      {
        orderId: "ORD-2024-001",
        customerName: "John Smith",
        orderAmount: 1250.00,
        orderDate: new Date("2024-01-15T14:30:00Z"),
        status: "completed",
        invoiceFileUrl: "https://mock-s3-bucket.com/invoices/ORD-2024-001.pdf",
        createdAt: new Date("2024-01-15T14:30:00Z"),
      },
      {
        orderId: "ORD-2024-002",
        customerName: "Sarah Johnson",
        orderAmount: 890.50,
        orderDate: new Date("2024-01-14T11:15:00Z"),
        status: "pending",
        invoiceFileUrl: "https://mock-s3-bucket.com/invoices/ORD-2024-002.pdf",
        createdAt: new Date("2024-01-14T11:15:00Z"),
      },
      {
        orderId: "ORD-2024-003",
        customerName: "Michael Brown",
        orderAmount: 2150.75,
        orderDate: new Date("2024-01-13T09:45:00Z"),
        status: "completed",
        invoiceFileUrl: "https://mock-s3-bucket.com/invoices/ORD-2024-003.pdf",
        createdAt: new Date("2024-01-13T09:45:00Z"),
      },
    ];

    mockOrders.forEach(order => {
      this.orders.set(order.orderId, order);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Order methods
  async getOrder(orderId: string): Promise<Order | undefined> {
    return this.orders.get(orderId);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const orderId = `ORD-${new Date().getFullYear()}-${String(this.orders.size + 1).padStart(3, '0')}`;
    const now = new Date();
    
    // Mock S3 upload - generate a mock URL
    const mockInvoiceUrl = `https://mock-s3-bucket.com/invoices/${orderId}.pdf`;
    
    const order: Order = {
      orderId,
      customerName: insertOrder.customerName,
      orderAmount: insertOrder.orderAmount,
      orderDate: insertOrder.orderDate ? new Date(insertOrder.orderDate) : now,
      status: "pending",
      invoiceFileUrl: mockInvoiceUrl,
      createdAt: now,
    };
    
    this.orders.set(orderId, order);
    return order;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(orderId);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(orderId, updatedOrder);
    return updatedOrder;
  }
}

export const storage = new MemStorage();
