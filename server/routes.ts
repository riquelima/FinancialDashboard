import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get dashboard data
  app.get("/api/dashboard", async (req, res) => {
    try {
      const dashboardData = await storage.getDashboardData();
      if (!dashboardData) {
        return res.status(404).json({ message: "Dashboard data not found" });
      }
      res.json(dashboardData);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/financial-data", async (req, res) => {
    try {
      const updatedData = await storage.updateFinancialData(req.body);
      res.json(updatedData);
    } catch (error) {
      console.error("Error updating financial data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/expense-categories", async (req, res) => {
    try {
      const updatedCategories = await storage.updateExpenseCategories(req.body);
      res.json(updatedCategories);
    } catch (error) {
      console.error("Error updating expense categories:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/monthly-summary", async (req, res) => {
    try {
      const updatedSummary = await storage.updateMonthlySummary(req.body);
      res.json(updatedSummary);
    } catch (error) {
      console.error("Error updating monthly summary:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}