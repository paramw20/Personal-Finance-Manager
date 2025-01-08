import React, { useEffect, useRef, useState } from 'react';
import { useFetcher } from 'react-router-dom';

const SavingsGoalsForm = () => {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const formRef = useRef();
  const focusRef = useRef();
  
  const [savingsGoals, setSavingsGoals] = useState([]);

  useEffect(() => {
    if (!isSubmitting) {
      formRef.current?.reset();
      focusRef.current?.focus();
    }
  }, [isSubmitting]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newGoal = {
      id: Date.now(),
      goal: formData.get('goalName'),
      amount: formData.get('goalAmount'),
      targetDate: formData.get('targetDate'),
      createdAt: new Date().toLocaleDateString()
    };
    
    setSavingsGoals(prev => [...prev, newGoal]);
    formRef.current.reset();
  };

  return (
    <div className="form-wrapper">
      <div className="grid-sm">
        <h2 className="h3">Create Savings Goal</h2>
        <fetcher.Form
          method="post"
          className="grid-sm"
          ref={formRef}
        >
          <input type="hidden" name="_action" value="createSavingsGoal" />
          
          <div className="grid-xs">
            <label htmlFor="goalName">Goal Name</label>
            <input
              type="text"
              name="goalName"
              id="goalName"
              placeholder="e.g., New Car"
              required
              ref={focusRef}
            />
          </div>

          <div className="grid-xs">
            <label htmlFor="targetAmount">Target Amount</label>
            <input
              type="number"
              step="0.01"
              name="targetAmount"
              id="targetAmount"
              placeholder="e.g., 5000"
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
              required
            />
          </div>

          <div className="grid-xs">
            <label htmlFor="initialDeposit">Initial Deposit (Optional)</label>
            <input
              type="number"
              step="0.01"
              name="initialDeposit"
              id="initialDeposit"
              placeholder="e.g., 1000"
              inputMode="decimal"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn--dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : (
              <span>Save Goal</span>
            )}
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
};

export default SavingsGoalsForm;