import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all orders
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Get order by ID
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Create new order
  app.post("/api/orders", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertOrderSchema.parse(req.body);
      
      // Create order
      const order = await storage.createOrder(validatedData);
      
      // Mock SNS notification
      console.log(`📧 SNS Notification: Order ${order.orderId} created for ${order.customerName}`);
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Update order status
  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const order = await storage.updateOrderStatus(id, status);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Mock SNS notification
      console.log(`📧 SNS Notification: Order ${order.orderId} status updated to ${status}`);
      
      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Mock file upload endpoint
  app.post("/api/upload", async (req, res) => {
    try {
      // Simulate file processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock S3 upload response
      const mockFileUrl = `https://mock-s3-bucket.com/invoices/${Date.now()}.pdf`;
      
      res.json({ 
        url: mockFileUrl,
        message: "File uploaded successfully" 
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Get order statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      
      const stats = {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + order.orderAmount, 0),
        pendingOrders: orders.filter(order => order.status === "pending").length,
        todayOrders: orders.filter(order => {
          const today = new Date();
          const orderDate = new Date(order.orderDate);
          return orderDate.toDateString() === today.toDateString();
        }).length,
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
