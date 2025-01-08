import React, { useState } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';
import { formatCurrency } from '../helpers';

const BudgetReports = ({ budgets, expenses }) => {
  const [timeFrame, setTimeFrame] = useState('monthly');

  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Filter expenses for current month/year
  const filterExpenses = () => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.createdAt);
      if (timeFrame === 'monthly') {
        return expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear;
      } else {
        return expenseDate.getFullYear() === currentYear;
      }
    });
  };

  // Calculate spending by category
  const calculateSpendingByBudget = () => {
    const filteredExpenses = filterExpenses();
    const spendingByBudget = budgets.map(budget => {
      const budgetExpenses = filteredExpenses.filter(
        expense => expense.budgetId === budget.id
      );
      const spent = budgetExpenses.reduce(
        (acc, expense) => acc + expense.amount, 
        0
      );
      return {
        name: budget.name,
        amount: spent,
        color: budget.color
      };
    });
    return spendingByBudget;
  };

  // Calculate monthly trends
  const calculateMonthlyTrends = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return months.map((month, index) => {
      const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.createdAt);
        return expenseDate.getMonth() === index && 
               expenseDate.getFullYear() === currentYear;
      });

      const spent = monthlyExpenses.reduce(
        (acc, expense) => acc + expense.amount, 
        0
      );

      const budgeted = budgets.reduce(
        (acc, budget) => acc + budget.amount, 
        0
      );

      return {
        name: month,
        expenses: spent,
        budget: budgeted,
        savings: budgeted - spent
      };
    });
  };

  const spendingData = calculateSpendingByBudget();
  const monthlyTrends = calculateMonthlyTrends();

  return (
    <div className="grid-lg">
      <div className="flex-lg">
        <h2>Financial Reports</h2>
        <div className="flex-sm">
          <button 
            className={`btn ${timeFrame === 'monthly' ? 'btn--dark' : 'btn--outline'}`}
            onClick={() => setTimeFrame('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`btn ${timeFrame === 'yearly' ? 'btn--dark' : 'btn--outline'}`}
            onClick={() => setTimeFrame('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="grid-md">
        <div className="card">
          <h3>Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={spendingData}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({name, percent}) => 
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {spendingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
              />
              <Legend />
              <Bar dataKey="budget" fill="#4B5563" name="Budgeted" />
              <Bar dataKey="expenses" fill="#DC2626" name="Expenses" />
              <Bar dataKey="savings" fill="#059669" name="Savings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BudgetReports;