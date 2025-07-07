// In-memory storage implementation for Vercel
class MemStorage {
  constructor() {
    this.financialDataStore = new Map();
    this.initializeData();
  }

  initializeData() {
    const initialFinancialData = {
      id: 1,
      monthStartSalary: "3700.00",
      monthStartFgts: "200.00",
      monthStartBonuses: "781.31",
      monthEndSalary: "3700.00",
      monthEndBenefits: "1485.00",
      netTotal: "9876.31",
      remainingBalance: "2631.31",
      createdAt: new Date(),
    };

    this.financialDataStore.set(1, initialFinancialData);
  }

  async updateFinancialData(data) {
    const existingData = this.financialDataStore.get(1);
    if (!existingData) {
      throw new Error("Financial data not found");
    }

    const updatedData = { ...existingData, ...data };
    this.financialDataStore.set(1, updatedData);
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
      const updatedData = await storage.updateFinancialData(req.body);
      res.status(200).json(updatedData);
    } catch (error) {
      console.error("Error updating financial data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}