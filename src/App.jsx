import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import AppLayout from "./layouts/app-layout";
import Dashboard from "./pages/dashboard";
import LinkPage from "./pages/link.jsx";
import HealthCheck from "./pages/HealthCheck.jsx";


import RedirectLink from "./pages/redirect-link";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Dashboard /> },          // homepage
      { path: "/healthz", element: <HealthCheck /> }, // <-- ADD THIS BEFORE WILDCARD
      { path: "/code/:code", element: <LinkPage /> }, // stats
      { path: "/:code", element: <RedirectLink /> },  // redirect short links
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
