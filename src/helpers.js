export const waait = () =>
  new Promise((res) => setTimeout(res, Math.random() * 800));

// colors
const generateRandomColor = () => {
  const existingBudgetLength = fetchData("budgets")?.length ?? 0;
  return `${existingBudgetLength * 34} 65% 50%`;
};

// Local storage
export const fetchData = (key) => {
  return JSON.parse(localStorage.getItem(key)) || [];
};

// Get all items from local storage
export const getAllMatchingItems = ({ category, key, value }) => {
  const data = fetchData(category) ?? [];
  return data.filter((item) => item[key] === value);
};

// delete item from local storage
export const deleteItem = ({ key, id }) => {
  const existingData = fetchData(key);
  if (id) {
    const newData = existingData.filter((item) => item.id !== id);
    return localStorage.setItem(key, JSON.stringify(newData));
  }
  return localStorage.removeItem(key);
};

// create budget
export const createBudget = ({ name, amount }) => {
  const newItem = {
    id: crypto.randomUUID(),
    name: name,
    createdAt: Date.now(),
    amount: +amount,
    color: generateRandomColor(),
  };
  const existingBudgets = fetchData("budgets") ?? [];
  return localStorage.setItem(
    "budgets",
    JSON.stringify([...existingBudgets, newItem])
  );
};







// create expense
export const createExpense = ({ name, amount, budgetId }) => {
  const newItem = {
    id: crypto.randomUUID(),
    name: name,
    createdAt: Date.now(),
    amount: +amount,
    budgetId: budgetId,
  };
  const existingExpenses = fetchData("expenses") ?? [];
  return localStorage.setItem(
    "expenses",
    JSON.stringify([...existingExpenses, newItem])
  );
};

export const registerUser = (userData) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Check if username already exists
  if (users.find(user => user.username === userData.username)) {
    throw new Error('Username already exists');
  }
  
  // Add new user
  users.push({
    username: userData.username,
    password: userData.password, 
    id: crypto.randomUUID()
  });
  
  localStorage.setItem('users', JSON.stringify(users));
}

export const loginUser = (credentials) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(
    user => user.username === credentials.username && 
    user.password === credentials.password
  );
  
  if (!user) {
    throw new Error('Invalid username or password');
  }
  
  // Set auth token
  localStorage.setItem('authToken', user.id);
  localStorage.setItem('userName', JSON.stringify(user.username));
  
  return user;
}

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userName');
}

export const checkAuth = () => {
  return localStorage.getItem('authToken') !== null;
}

// total spent by budget
export const calculateSpentByBudget = (budgetId) => {
  const expenses = fetchData("expenses") ?? [];
  const budgetSpent = expenses.reduce((acc, expense) => {
    // check if expense.id === budgetId I passed in
    if (expense.budgetId !== budgetId) return acc;

    // add the current amount to my total
    return (acc += expense.amount);
  }, 0);
  return budgetSpent;
};



// FORMATTING
export const formatDateToLocaleString = (epoch) =>
  new Date(epoch).toLocaleDateString();

// Formating percentages
export const formatPercentage = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
  });
};

// Format currency
export const formatCurrency = (amt) => {
  if (amt === undefined || amt === null || isNaN(amt)) {
    return "Invalid Amount"; // Fallback for invalid values
  }
  return parseFloat(amt).toLocaleString(undefined, {
    style: "currency",
    currency: "INR",
  });
};

// helpers.js
export const calculateSavingsProgress = (goalId, transactions) => {
  const goal = fetchGoalById(goalId); // Fetch goal by ID
  const income = transactions.filter(transaction => transaction.type === 'income' && transaction.goalId === goalId).reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(transaction => transaction.type === 'expense' && transaction.goalId === goalId).reduce((sum, t) => sum + t.amount, 0);
  
  const amountSaved = income - expenses;
  const progress = (amountSaved / goal.targetAmount) * 100;

  return { amountSaved, progress };
};
