import React from 'react';
import { toast } from "react-toastify";

const formatPercentage = (decimal) => {
  return `${(decimal * 100).toFixed(1)}%`;
};

const SavingsGoalItem = ({ goal, showDelete = true }) => {
  const calculateProgress = () => {
    const targetAmount = parseFloat(goal.targetAmount) || 0;
    const currentAmount = parseFloat(goal.currentAmount) || 0;
    const progressPercent = (currentAmount / targetAmount) * 100;

    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const monthsRemaining = Math.max(
      0,
      (targetDate.getFullYear() - today.getFullYear()) * 12 + 
      (targetDate.getMonth() - today.getMonth())
    );

    const remainingAmount = targetAmount - currentAmount;
    const requiredMonthlySavings = monthsRemaining > 0 ? remainingAmount / monthsRemaining : remainingAmount;

    return {
      progressPercent: Math.min(Math.max(progressPercent, 0), 100),
      monthsRemaining,
      requiredMonthlySavings
    };
  };

  const handleDelete = () => {
    try {
      const goals = JSON.parse(localStorage.getItem("savingsGoals")) || [];
      const updatedGoals = goals.filter(g => g.id !== goal.id);
      localStorage.setItem("savingsGoals", JSON.stringify(updatedGoals));
      toast.success("Goal deleted successfully!");
      window.location.reload();
    } catch (error) {
      toast.error("Error deleting goal");
    }
  };

  const progress = calculateProgress();

  const styles = `
    .progress-container {
      width: 100%;
      height: 16px;
      background-color: #22c55e;
      border-radius: 9999px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background-color: #fbbf24;
      border-radius: 9999px;
      transition: width 0.3s ease;
    }

    .btn--dark {
      background-color: #1f2937;
      color: white;
      border-radius: 0.375rem;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .btn--dark:hover {
      background-color: #111827;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="goal bg-white p-4 rounded-lg shadow-md" style={{ 
        borderLeft: `4px solid ${goal.color || '#4F46E5'}`,
        marginBottom: '1rem' 
      }}>
        <div className="progress-text space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">{goal.name}</h3>
            {showDelete && (
              <button 
                onClick={handleDelete} 
                className="btn btn--dark"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }} 
              >
                Delete Goal
              </button>
            )}
          </div>

          <div className="mt-4">
            <p>Target: Rs {parseFloat(goal.targetAmount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <p>Current: Rs {parseFloat(goal.currentAmount || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <p>Due by: {new Date(goal.targetDate).toLocaleDateString()}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress: {formatPercentage(progress.progressPercent / 100)}</span>
              <span> Rs {parseFloat(goal.currentAmount || 0).toLocaleString()} of Rs {parseFloat(goal.targetAmount).toLocaleString()}</span>
            </div>
            
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{
                  width: `${progress.progressPercent}%`
                }}
              />
            </div>
          </div>
          
          <div className="mt-2">
            <p>Months remaining: {progress.monthsRemaining}</p>
            <p>Required monthly savings: Rs {progress.requiredMonthlySavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SavingsGoalItem;