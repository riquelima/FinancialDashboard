// In-memory storage implementation for Vercel
class MemStorage {
  constructor() {
    this.monthlySummaryStore = new Map();
    this.initializeData();
  }

  initializeData() {
    const initialMonthlySummary = {
      id: 1,
      financialDataId: 1,
      totalPlanned: "7245.00",
      totalSpent: "6644.54",
      variance: "-600.46",
      variancePercentage: "-8.29",
    };

    this.monthlySummaryStore.set(1, initialMonthlySummary);
  }

  async updateMonthlySummary(data) {
    const existingData = this.monthlySummaryStore.get(1);
    if (!existingData) {
      throw new Error("Monthly summary not found");
    }

    const updatedData = { ...existingData, ...data };
    this.monthlySummaryStore.set(1, updatedData);
    return updatedData;
  }
}

const storage = new MemStorage();

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'PUT') {
    try {
      const updatedSummary = await storage.updateMonthlySummary(req.body);
      res.status(200).json(updatedSummary);
    } catch (error) {
      console.error("Error updating monthly summary:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}