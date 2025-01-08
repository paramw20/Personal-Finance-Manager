// helpers.js
export const fetchMonthlyReportData = (budgetId) => {

    const expenses = fetchData("expenses").filter(expense => expense.budgetId === budgetId);
    
    // Calculate total expenses by category
    const categories = [...new Set(expenses.map(expense => expense.category))];
    const expensesByCategory = categories.map(category => 
      expenses.filter(expense => expense.category === category).reduce((sum, expense) => sum + expense.amount, 0)
    );
  
    // Calculate total income, expenses, and savings
    const income = fetchData("income").reduce((sum, item) => sum + item.amount, 0); 
    const expensesTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const savings = income - expensesTotal;
  
    return {
      categories,
      expenses: expensesByCategory,
      income,
      expensesTotal,
      savings,
    };
  };
  