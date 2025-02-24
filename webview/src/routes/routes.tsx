import Lobby from '@/pages/lobby';

const routes: {
  path: string;
  element: JSX.Element;
  isPublicRoute: boolean;
}[] = [
  { path: '/', element: <Lobby />, isPublicRoute: true },
  // { path: '/dashboard', element: <Dashboard />, isPublicRoute: false },
  // { path: '/plans', element: <Plans />, isPublicRoute: false },
  // { path: '/permissions', element: <Permissions />, isPublicRoute: false },
  // { path: '/subscriptions', element: <Subscriptions />, isPublicRoute: false },
  // { path: '/prompts', element: <Prompts />, isPublicRoute: false },
  // { path: '/logs', element: <Logs />, isPublicRoute: false },
];

export default routes;
