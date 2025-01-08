import { Link, useFetcher } from "react-router-dom";
import { useState } from "react";
import { TrashIcon, PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/solid";

import {
  formatCurrency,
  formatDateToLocaleString,
  getAllMatchingItems,
} from "../helpers";

const ExpenseItem = ({ expense, showBudget }) => {
  const fetcher = useFetcher();
  const [isEditing, setIsEditing] = useState(false);
  const [newExpenseName, setNewExpenseName] = useState(expense.name);
  const [newExpenseAmount, setNewExpenseAmount] = useState(expense.amount);
  const [newExpenseBudget, setNewExpenseBudget] = useState(expense.budgetId);

  const budget = getAllMatchingItems({
    category: "budgets",
    key: "id",
    value: expense.budgetId,
  })[0];

  const allBudgets = getAllMatchingItems({
    category: "budgets",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetcher.submit(
      {
        _action: "editExpense",
        expenseId: expense.id,
        newExpenseName,
        newExpenseAmount,
        newExpenseBudget,
      },
      { method: "post" }
    );
    setIsEditing(false);
  };

  return (
    <>
      <td>{!isEditing ? expense.name : (
        <input
          type="text"
          name="newExpenseName"
          value={newExpenseName}
          onChange={(e) => setNewExpenseName(e.target.value)}
          required
          className="input-sm"
        />
      )}</td>
      <td>{!isEditing ? formatCurrency(expense.amount) : (
        <input
          type="number"
          name="newExpenseAmount"
          value={newExpenseAmount}
          onChange={(e) => setNewExpenseAmount(e.target.value)}
          required
          step="0.01"
          min="0"
          className="input-sm"
        />
      )}</td>
      <td>{formatDateToLocaleString(expense.createdAt)}</td>
      {showBudget && (
        <td>
          {!isEditing ? (
            <Link
              to={`/budget/${budget.id}`}
              style={{
                "--accent": budget.color,
              }}
            >
              {budget.name}
            </Link>
          ) : (
            <select
              name="newExpenseBudget"
              value={newExpenseBudget}
              onChange={(e) => setNewExpenseBudget(e.target.value)}
              className="input-sm"
              required
            >
              {allBudgets.map((budget) => (
                <option key={budget.id} value={budget.id}>
                  {budget.name}
                </option>
              ))}
            </select>
          )}
        </td>
      )}
      <td>
        <div className="flex gap-2">
          {isEditing ? (
            <fetcher.Form method="post" onSubmit={handleSubmit} className="flex gap-2">
              <input type="hidden" name="_action" value="editExpense" />
              <input type="hidden" name="expenseId" value={expense.id} />
              
              <button
                type="submit"
                className="btn btn--dark"
                aria-label={`Save edit for ${expense.name} expense`}
              >
                Save
              </button>
              
              <button
                type="button"
                className="btn btn--dark"
                onClick={() => setIsEditing(false)}
                aria-label="Cancel edit"
              >
                <XMarkIcon width={20} />
              </button>
            </fetcher.Form>
          ) : (
            <button
              type="button"
              className="btn btn--dark"
              onClick={() => setIsEditing(true)}
              aria-label={`Edit ${expense.name} expense`}
            >
              <PencilSquareIcon width={20} />
            </button>
          )}

          <fetcher.Form method="post">
            <input type="hidden" name="_action" value="deleteExpense" />
            <input type="hidden" name="expenseId" value={expense.id} />
 <button
              type="submit"
              className="btn btn--warning"
              aria-label={`Delete ${expense.name} expense`}
            >
              <TrashIcon width={20} />
            </button>
          </fetcher.Form>
        </div>
      </td>
    </>
  );
};

export default ExpenseItem;