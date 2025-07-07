// In-memory storage implementation for Vercel
class MemStorage {
  constructor() {
    this.financialDataStore = new Map();
    this.expenseCategoriesStore = new Map();
    this.monthlySummaryStore = new Map();
    this.currentFinancialId = 1;
    this.currentExpenseCategoryId = 1;
    this.currentMonthlySummaryId = 1;
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

    const initialExpenseCategories = [
      {
        id: 1,
        financialDataId: 1,
        categoryType: "essential",
        percentage: 70,
        plannedAmount: "5569.20",
        actualAmount: "5344.54",
        budgetStatus: "under",
      },
      {
        id: 2,
        financialDataId: 1,
        categoryType: "non_essential",
        percentage: 8,
        plannedAmount: "946.90",
        actualAmount: "950.00",
        budgetStatus: "over",
      },
      {
        id: 3,
        financialDataId: 1,
        categoryType: "investments",
        percentage: 17,
        plannedAmount: "1555.00",
        actualAmount: "1350.00",
        budgetStatus: "under",
      },
      {
        id: 4,
        financialDataId: 1,
        categoryType: "leisure",
        percentage: 5,
        plannedAmount: "570.00",
        actualAmount: "0.00",
        budgetStatus: "under",
      },
    ];

    const initialMonthlySummary = {
      id: 1,
      financialDataId: 1,
      totalPlanned: "7245.00",
      totalSpent: "6644.54",
      variance: "-600.46",
      variancePercentage: "-8.29",
    };

    this.financialDataStore.set(1, initialFinancialData);
    initialExpenseCategories.forEach(category => {
      this.expenseCategoriesStore.set(category.id, category);
    });
    this.monthlySummaryStore.set(1, initialMonthlySummary);
  }

  async getDashboardData() {
    const financialData = this.financialDataStore.get(1);
    const expenseCategories = Array.from(this.expenseCategoriesStore.values());
    const monthlySummary = this.monthlySummaryStore.get(1);

    if (!financialData || !monthlySummary) {
      return null;
    }

    return {
      financialData,
      expenseCategories,
      monthlySummary,
    };
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

  async updateExpenseCategories(categories) {
    const updatedCategories = [];
    for (const category of categories) {
      this.expenseCategoriesStore.set(category.id, category);
      updatedCategories.push(category);
    }
    return updatedCategories;
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

  if (req.method === 'GET') {
    try {
      const data = await storage.getDashboardData();
      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json(data);
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ error: 'Failed to load dashboard' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}