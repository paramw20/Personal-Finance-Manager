import { Form, redirect, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

export async function loginAction({ request }) {
  const data = await request.formData();
  const { username, password } = Object.fromEntries(data);

  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      user => user.username === username && user.password === password
    );
    
    if (!user) {
      throw new Error('Invalid username or password');
    }
    
    // Set auth token and username
    localStorage.setItem('authToken', user.id);
    localStorage.setItem('userName', JSON.stringify(username));
    
    toast.success("Login successful!");
    return redirect("/dashboard");
  } catch (e) {
    throw new Error(e.message);
  }
}

const Login = () => {
  const [error, setError] = useState("");

  return (
    <div className="intro">
      <div>
        <h1>
          Welcome <span className="accent">Back</span>
        </h1>
        
        <Form method="post">
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
            autoComplete="current-password"
          />
          
          {error && (
            <p className="error">{error}</p>
          )}
          
          <button type="submit" className="btn btn--dark">
            <span>Login</span>
            <ArrowRightOnRectangleIcon width={20} />
          </button>
        </Form>
        
        <p className="auth-link">
          Don't have an account?{" "}
          <a href="/register" className="accent">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;