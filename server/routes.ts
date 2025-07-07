
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current financial data
  app.get("/api/financial-data", async (req, res) => {
    try {
      const data = await storage.getFinancialData();
      res.json(data);
    } catch (error) {
      console.error("Error fetching financial data:", error);
      res.status(500).json({ error: "Failed to fetch financial data" });
    }
  });

  // Create new financial data
  app.post("/api/financial-data", async (req, res) => {
    try {
      const data = await storage.createFinancialData(req.body);
      res.status(201).json(data);
    } catch (error) {
      console.error("Error creating financial data:", error);
      res.status(500).json({ error: "Failed to create financial data" });
    }
  });

  // Update financial data
  app.put("/api/financial-data", async (req, res) => {
    try {
      const data = await storage.updateFinancialData(req.body);
      res.json(data);
    } catch (error) {
      console.error("Error updating financial data:", error);
      res.status(500).json({ error: "Failed to update financial data" });
    }
  });

  // Update income data
  app.put("/api/financial-data/income", async (req, res) => {
    try {
      const data = await storage.updateIncomeData(req.body);
      res.json(data);
    } catch (error) {
      console.error("Error updating income data:", error);
      res.status(500).json({ error: "Failed to update income data" });
    }
  });

  // Create new expense category
  app.post("/api/financial-data/expense", async (req, res) => {
    try {
      const data = await storage.createExpenseCategory(req.body);
      res.status(201).json(data);
    } catch (error) {
      console.error("Error creating expense category:", error);
      res.status(500).json({ error: "Failed to create expense category" });
    }
  });

  // Update expense category
  app.put("/api/financial-data/expense/:categoryId", async (req, res) => {
    try {
      const { categoryId } = req.params;
      const data = await storage.updateExpenseCategory(categoryId, req.body);
      res.json(data);
    } catch (error) {
      console.error("Error updating expense category:", error);
      res.status(500).json({ error: "Failed to update expense category" });
    }
  });

  // Delete expense category
  app.delete("/api/financial-data/expense/:categoryId", async (req, res) => {
    try {
      const { categoryId } = req.params;
      const data = await storage.deleteExpenseCategory(categoryId);
      res.json(data);
    } catch (error) {
      console.error("Error deleting expense category:", error);
      res.status(500).json({ error: "Failed to delete expense category" });
    }
  });

  // Delete financial data
  app.delete("/api/financial-data", async (req, res) => {
    try {
      await storage.deleteFinancialData();
      res.json({ success: true, message: "Financial data deleted successfully" });
    } catch (error) {
      console.error("Error deleting financial data:", error);
      res.status(500).json({ error: "Failed to delete financial data" });
    }
  });

  // Refresh financial data endpoint
  app.post("/api/refresh-data", async (req, res) => {
    try {
      const data = await storage.refreshFinancialData();
      res.json({ success: true, message: "Data refreshed successfully", data });
    } catch (error) {
      console.error("Error refreshing data:", error);
      res.status(500).json({ error: "Failed to refresh data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
