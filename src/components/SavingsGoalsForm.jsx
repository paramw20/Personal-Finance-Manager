// SavingsGoalsForm.jsx
import React, { useEffect, useRef } from 'react';
import { toast } from "react-toastify";

const SavingsGoalsForm = () => {
  const formRef = useRef();
  const focusRef = useRef();

  const generateColor = () => {
    const colors = [
      "#4F46E5", "#7C3AED", "#EC4899", "#F59E0B", 
      "#10B981", "#3B82F6", "#6366F1", "#8B5CF6"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Validate amounts
    const targetAmount = parseFloat(formData.get('targetAmount'));
    const initialDeposit = parseFloat(formData.get('initialDeposit') || 0);
    
    if (isNaN(targetAmount) || targetAmount <= 0) {
      toast.error("Please enter a valid target amount");
      return;
    }

    if (isNaN(initialDeposit) || initialDeposit < 0) {
      toast.error("Please enter a valid initial deposit");
      return;
    }

    // Get existing goals from localStorage
    const existingGoals = JSON.parse(localStorage.getItem("savingsGoals")) || [];
    
    const newGoal = {
      id: crypto.randomUUID(),
      name: formData.get('goalName'),
      targetAmount: targetAmount,
      targetDate: formData.get('targetDate'),
      currentAmount: initialDeposit,
      color: generateColor(),
      createdAt: Date.now()
    };

    try {
      localStorage.setItem(
        "savingsGoals",
        JSON.stringify([...existingGoals, newGoal])
      );
      
      // Reset form
      formRef.current.reset();
      focusRef.current.focus();
      
      toast.success(`Savings goal "${newGoal.name}" created!`);
      window.location.reload();
    } catch (error) {
      toast.error("Error creating savings goal");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="grid-sm">
        <h2 className="h3">Create Savings Goal</h2>
        <form
          onSubmit={handleSubmit}
          className="grid-sm"
          ref={formRef}
        >
          <div className="grid-xs">
            <label htmlFor="goalName">Goal Name</label>
            <input
              type="text"
              name="goalName"
              id="goalName"
              placeholder="e.g New Car"
              required
              ref={focusRef}
            />
          </div>

          <div className="grid-xs">
            <label htmlFor="targetAmount">Target Amount (Rs)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              name="targetAmount"
              id="targetAmount"
              placeholder="e.g 5000"
              required
              inputMode="decimal"
            />
          </div>

          <div className="grid-xs">
            <label htmlFor="targetDate">Target Date</label>
            <input
              type="date"
              name="targetDate"
              id="targetDate"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="grid-xs">
            <label htmlFor="initialDeposit">Initial Deposit (Rs) (Optional)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="initialDeposit"
              id="initialDeposit"
              placeholder="e.g 1000"
              inputMode="decimal"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn--dark"
          >
            Save Goal
          </button>
        </form>
      </div>
    </div>
  );
};

export default SavingsGoalsForm;