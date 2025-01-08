// rrd imports
import { Link, useLoaderData } from "react-router-dom";

// library imports
import { toast } from "react-toastify";

// components
import Intro from "../components/Intro";
import AddBudgetForm from "../components/AddBudgetForm";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";
;
import BudgetReports from "../components/BudgetReports";
import AddSavingsGoalForm from "../components/AddSavingsGoalForm";
import SavingsGoalItem from "../components/SavingsGoalItem";
import SavingsGoalsForm from "../components/SavingsGoalsForm"

//  helper functions
import {
  createBudget,
  createExpense,
  deleteItem,
  fetchData,
  waait,
} from "../helpers";

const calculateGoalProgress = (goal, budgets, expenses) => {
  // Get total budget amount
  const totalBudget = budgets.reduce((acc, budget) => acc + parseFloat(budget.amount), 0);
  
  // Get total expenses
  const totalExpenses = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
  
  // Calculate savings (budget - expenses)
  const savings = totalBudget - totalExpenses;
  
  // Calculate progress percentage
  const progress = (savings / parseFloat(goal.amount)) * 100;
  
  // Calculate monthly savings rate
  const monthlySavings = savings / budgets.length; // Assuming one budget per month
  
  // Calculate months remaining until target date
  const today = new Date();
  const targetDate = new Date(goal.targetDate);
  const monthsRemaining = (targetDate.getFullYear() - today.getFullYear()) * 12 + 
    (targetDate.getMonth() - today.getMonth());
  
  // Calculate if on track (based on required monthly savings)
  const requiredMonthlySavings = (goal.amount - savings) / monthsRemaining;
  const isOnTrack = monthlySavings >= requiredMonthlySavings;

  return {
    currentSavings: savings,
    progressPercentage: Math.min(Math.max(progress, 0), 100), // Clamp between 0-100
    monthsRemaining,
    monthlySavings,
    requiredMonthlySavings,
    isOnTrack
  };
};


// loader
export function dashboardLoader() {
  const userName = fetchData("userName");
  const budgets = fetchData("budgets");
  const expenses = fetchData("expenses");
  const savingsGoals = fetchData("savingsGoals");
  const goalsWithProgress = savingsGoals ? savingsGoals.map(goal => ({
    ...goal,
    progress: calculateGoalProgress(goal, budgets || [], expenses || [])
  })) : [];
  
  return { userName, budgets, expenses, savingsGoals: goalsWithProgress };
}

// action
// action
export async function dashboardAction({ request }) {
  await waait();

  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  // new user submission
  if (_action === "newUser") {
    try {
      localStorage.setItem("userName", JSON.stringify(values.userName));
      toast.success(`Welcome, ${values.userName}`);
    } catch (e) {
      toast.error("There was a problem creating your account.");
    }
  }

  if (_action === "createSavingsGoal") {
    try {
      const existingGoals = fetchData("savingsGoals") || [];
      const newGoal = {
        id: crypto.randomUUID(),
        name: values.goalName,
        targetAmount: parseFloat(values.targetAmount),
        targetDate: values.targetDate,
        currentAmount: parseFloat(values.initialDeposit) || 0,
        color: `${generateColor()}`,
        createdAt: Date.now(),
        transactions: values.initialDeposit ? [{
          id: crypto.randomUUID(),
          amount: parseFloat(values.initialDeposit),
          date: new Date().toISOString(),
          type: 'deposit'
        }] : []
      };
  
      localStorage.setItem(
        "savingsGoals",
        JSON.stringify([...existingGoals, newGoal])
      );
      
      toast.success(`Savings goal "${values.goalName}" created!`);
    } catch (e) {
      toast.error("There was a problem creating your savings goal.");
    }
  }
  

  
  if (_action === "deleteSavingsGoal") {
    try {
      deleteItem({
        key: "savingsGoals",
        id: values.goalId,
      });
      toast.success("Savings goal deleted!");
    } catch (e) {
      toast.error("There was a problem deleting your savings goal.");
    }
  }

  const generateColor = () => {
    const colors = [
      "#65B741", "#FF6B6B", "#4ECDC4", "#45B7D1", 
      "#96C291", "#FFB84C", "#F11A7B", "#3085C3"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };


  if (_action === "editExpense") {
    try {
      // Get all expenses
      const expenses = fetchData("expenses");

      // Find the expense to update
      const expenseIndex = expenses.findIndex(expense => expense.id === values.expenseId);

      if (expenseIndex !== -1) {
        expenses[expenseIndex] = {
          ...expenses[expenseIndex],
          name: values.newExpenseName,
          amount: parseFloat(values.newExpenseAmount),
          budgetId: values.newExpenseBudget,
        };

        localStorage.setItem("expenses", JSON.stringify(expenses));
        toast.success(`Expense ${values.newExpenseName} updated!`);
      }

      // Return the updated expenses to trigger a re-render on the dashboard
      return { expenses };
    } catch (e) {
      toast.error("There was a problem updating your expense.");
    }
  }


  if (_action === "createBudget") {
    try {
      createBudget({
        name: values.newBudget,
        amount: values.newBudgetAmount,
      });
      toast.success("Budget created!");
    } catch (e) {
      toast.error("There was a problem creating your budget.");
    }
  }

  if (_action === "createExpense") {
    try {
      createExpense({
        name: values.newExpense,
        amount: values.newExpenseAmount,
        budgetId: values.newExpenseBudget,
      });
      toast.success(`Expense ${values.newExpense} created!`);
    } catch (e) {
      toast.error("There was a problem creating your expense.");
    }
  }

  if (_action === "deleteExpense") {
    try {
      deleteItem({
        key: "expenses",
        id: values.expenseId,
      });
      toast.success("Expense deleted!");
    } catch (e) {
      toast.error("There was a problem deleting your expense.");
    }
  }
  return null;
}


const Dashboard = () => {
  const { userName, budgets, expenses,savingsGoals } = useLoaderData();

  return (
    <>
      {userName ? (
        <div className="dashboard">
          <h1>
            Welcome back, <span className="accent">{userName}</span>
          </h1>
          <div className="grid-sm">
            {budgets && budgets.length > 0 ? (
              <div className="grid-lg">
                <div className="flex-lg">
                  <AddBudgetForm />
                  
                  <AddExpenseForm budgets={budgets} />
                </div>
                
              
                <div className="grid-md">
    <h2>Existing Budgets</h2>
    <div className="budgets">
      {budgets.map((budget) => (
        <BudgetItem key={budget.id} budget={budget} />
      ))}
    </div>
  </div>
  {savingsGoals && savingsGoals.length > 0 && (
  <div className="grid-md">
    <h2>Your Savings Goals</h2>
    <div className="goals">
      {savingsGoals
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((goal) => (
          <SavingsGoalItem 
            key={goal.id} 
            goal={goal}
            showDelete={true}
          />
        ))}
    </div>
  </div>
)}
  <div className="grid-md saving-goals">
    <h2>Saving Goals Form</h2>
    <SavingsGoalsForm />
  </div>
               
                {expenses && expenses.length > 0 && (
                  <div className="grid-md">
                    <h2>Recent Expenses</h2>
                    <Table
                      expenses={expenses
                        .sort((a, b) => b.createdAt - a.createdAt)
                        .slice(0, 8)}
                    />
                    {expenses.length > 8 && (
                      <Link to="expenses" className="btn btn--dark">
                        View all expenses
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid-sm">
                <p>Personal budgeting is the secret to financial freedom.</p>
                <p>Create a budget to get started!</p>
                <AddBudgetForm />
                
              </div>
            )}
              
           
            <BudgetReports budgets={budgets} expenses={expenses} />
          </div>
        </div>
      ) : (
        <Intro />
      )}
    </>
  );
};
export default Dashboard;
