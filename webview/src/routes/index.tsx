import { createBrowserRouter } from "react-router-dom";
import { SignIn } from "../pages/signIn";
import { Dashboard } from "../pages/dashboard";
import { ProtectedLayout } from "../components/ProtectedLayout";

export const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);
