import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import Main, { mainLoader } from "./layouts/Main";

// Actions
import { logoutAction } from "./actions/logout";
import { deleteBudget } from "./actions/deleteBudget";

// Routes
import Dashboard, { dashboardAction, dashboardLoader } from "./pages/Dashboard";
import Error from "./pages/Error";
import BudgetPage, { budgetAction, budgetLoader } from "./pages/BudgetPage";
import ExpensesPage, { expensesAction, expensesLoader } from "./pages/ExpensesPage";

// Auth Components
import Login, { loginAction } from "./components/Login";
import Register, { registerAction } from "./components/Register";
import { checkAuth } from "./helpers/auth";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    children: [
      // Public routes
      {
        index: true,
        element: <Register />,
        action: registerAction,
        loader: () => {
          if (checkAuth()) {
            return redirect("/dashboard");
          }
          return null;
        },
        errorElement: <Error />,
      },
      {
        path: "login",
        element: <Login />,
        action: loginAction,
        loader: () => {
          if (checkAuth()) {
            return redirect("/dashboard");
          }
          return null;
        },
        errorElement: <Error />,
      },
      // Protected routes within Main layout
      {
        element: <Main />,
        loader: mainLoader,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
            loader: () => {
              if (!checkAuth()) {
                return redirect("/login");
              }
              return dashboardLoader();
            },
            action: dashboardAction,
            errorElement: <Error />,
          },
          {
            path: "budget/:id",
            element: <BudgetPage />,
            loader: ({ params }) => {
              if (!checkAuth()) {
                return redirect("/login");
              }
              return budgetLoader({ params });
            },
            action: budgetAction,
            errorElement: <Error />,
            children: [
              {
                path: "delete",
                action: deleteBudget,
              },
            ],
          },
          {
            path: "expenses",
            element: <ExpensesPage />,
            loader: () => {
              if (!checkAuth()) {
                return redirect("/login");
              }
              return expensesLoader();
            },
            action: expensesAction,
            errorElement: <Error />,
          },
          {
            path: "logout",
            action: logoutAction,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;