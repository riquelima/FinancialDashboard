// In-memory storage implementation for Vercel
class MemStorage {
  constructor() {
    this.expenseCategoriesStore = new Map();
    this.initializeData();
  }

  initializeData() {
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

    initialExpenseCategories.forEach(category => {
      this.expenseCategoriesStore.set(category.id, category);
    });
  }

  async updateExpenseCategories(categories) {
    const updatedCategories = [];
    for (const category of categories) {
      this.expenseCategoriesStore.set(category.id, category);
      updatedCategories.push(category);
    }
    return updatedCategories;
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
      const updatedCategories = await storage.updateExpenseCategories(req.body);
      res.status(200).json(updatedCategories);
    } catch (error) {
      console.error("Error updating expense categories:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}