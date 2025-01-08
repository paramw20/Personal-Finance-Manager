import { useEffect, useRef } from "react";
import { useFetcher } from "react-router-dom";
import { PiggyBankIcon } from "@heroicons/react/24/solid";

const AddSavingsGoalForm = () => {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const formRef = useRef();
  const focusRef = useRef();

  // Load data from local storage when the component mounts
  useEffect(() => {
    const savedGoalName = localStorage.getItem("goalName");
    const savedTargetAmount = localStorage.getItem("targetAmount");
    const savedTargetDate = localStorage.getItem("targetDate");
    const savedInitialDeposit = localStorage.getItem("initialDeposit");

    if (savedGoalName) formRef.current.goalName.value = savedGoalName;
    if (savedTargetAmount) formRef.current.targetAmount.value = savedTargetAmount;
    if (savedTargetDate) formRef.current.targetDate.value = savedTargetDate;
    if (savedInitialDeposit) formRef.current.initialDeposit.value = savedInitialDeposit;
  }, []);

  useEffect(() => {
    if (!isSubmitting) {
      // Save data to local storage when the form is submitted
      const goalName = formRef.current.goalName.value;
      const targetAmount = formRef.current.targetAmount.value;
      const targetDate = formRef.current.targetDate.value;
      const initialDeposit = formRef.current.initialDeposit.value;

      localStorage.setItem("goalName", goalName);
      localStorage.setItem("targetAmount", targetAmount);
      localStorage.setItem("targetDate", targetDate);
      localStorage.setItem("initialDeposit", initialDeposit);

      // Reset the form
      formRef.current.reset();
      focusRef.current.focus();
    }
  }, [isSubmitting]);

  return (
    <div className="form-wrapper">
      <h2 className="h3">Create Savings Goal</h2>
      <fetcher.Form method="post" className="grid-sm" ref={formRef}>
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
            placeholder="e.g Rs 5000"
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
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="initialDeposit">Initial Deposit (Optional)</label>
          <input
            type="number"
            step="0.01"
            name="initialDeposit"
            id="initialDeposit"
            placeholder="e.g Rs 500"
            inputMode="decimal"
          />
        </div>

        <input type="hidden" name="_action" value="createSavingsGoal" />
        <button type="submit" className="btn btn--dark" disabled={isSubmitting}>
          {isSubmitting ? (
            <span>Creating Goal…</span>
          ) : (
            <>
              <span>Create Savings Goal</span>
              <PiggyBankIcon width={20} />
            </>
          )}
        </button>
      </fetcher.Form>
    </div>
  );
};

export default AddSavingsGoalForm;