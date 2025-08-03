import { apiRequest } from "./queryClient";
import type { Order, InsertOrder } from "@shared/schema";

export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await apiRequest("GET", "/api/orders");
    return response.json();
  },

  getById: async (id: string): Promise<Order> => {
    const response = await apiRequest("GET", `/api/orders/${id}`);
    return response.json();
  },

  create: async (order: InsertOrder): Promise<Order> => {
    const response = await apiRequest("POST", "/api/orders", order);
    return response.json();
  },

  updateStatus: async (id: string, status: string): Promise<Order> => {
    const response = await apiRequest("PATCH", `/api/orders/${id}/status`, { status });
    return response.json();
  },
};

export const statsApi = {
  get: async () => {
    const response = await apiRequest("GET", "/api/stats");
    return response.json();
  },
};

export const uploadApi = {
  uploadFile: async (file: File): Promise<{ url: string; message: string }> => {
    // Mock file upload - in real implementation, this would upload to S3
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      url: `https://mock-s3-bucket.com/invoices/${Date.now()}.pdf`,
      message: "File uploaded successfully"
    };
  },
};
