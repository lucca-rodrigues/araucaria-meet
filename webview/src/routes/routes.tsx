import Dashboard from "@/pages/dashboard";
import Plans from "@/pages/plans";
import Login from "@/pages/signIn";
import Permissions from "@/pages/permissions";
import Subscriptions from "@/pages/subscriptions";
import Prompts from "@/pages/prompts";
import Logs from "@/pages/logs";

const routes: {
  path: string;
  element: JSX.Element;
  isPublicRoute: boolean;
}[] = [
  { path: "/", element: <Login />, isPublicRoute: true },
  { path: "/dashboard", element: <Dashboard />, isPublicRoute: false },
  { path: "/plans", element: <Plans />, isPublicRoute: false },
  { path: "/permissions", element: <Permissions />, isPublicRoute: false },
  { path: "/subscriptions", element: <Subscriptions />, isPublicRoute: false },
  { path: "/prompts", element: <Prompts />, isPublicRoute: false },
  { path: "/logs", element: <Logs />, isPublicRoute: false },
];

export default routes;
