import { Form, redirect } from "react-router-dom";
import { useState } from "react";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

export async function registerAction({ request }) {
  const data = await request.formData();
  const { username, password, confirmPassword } = Object.fromEntries(data);

  if (password !== confirmPassword) {
    throw new Error("Passwords don't match");
  }

  try {
    // Get existing users or initialize empty array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if username exists
    if (users.find(user => user.username === username)) {
      throw new Error('Username already exists');
    }
    
    // Add new user
    users.push({
      username,
      password,
      id: crypto.randomUUID()
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    toast.success("Registration successful! Please login.");
    return redirect("/login");
  } catch (e) {
    throw new Error(e.message);
  }
}

const Register = () => {
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    const form = e.target;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      e.preventDefault();
      setError("Passwords don't match");
      return;
    }
    setError("");
  };

  return (
    <div className="intro">
      <div>
        <h1>
          Take Control of <span className="accent">Your Money</span>
        </h1>
        <p>
          Personal budgeting is the secret to financial freedom. Start your journey today.
        </p>
        
        <Form method="post" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            required
            placeholder="Username"
            aria-label="Username"
            autoComplete="username"
          />
          
          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            aria-label="Password"
            autoComplete="new-password"
          />
          
          <input
            type="password"
            name="confirmPassword"
            required
            placeholder="Confirm Password"
            aria-label="Confirm Password"
            autoComplete="new-password"
          />
          
          {error && (
            <p className="error">{error}</p>
          )}
          
          <button type="submit" className="btn btn--dark">
            <span>Create Account</span>
            <UserPlusIcon width={20} />
          </button>
        </Form>
        
        <p className="auth-link">
          Already have an account?{" "}
          <a href="/login" className="accent">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;