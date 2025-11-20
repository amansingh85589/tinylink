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
      { path: "/healthz", element: <HealthCheck /> },  // system ping route

      { path: "/code/:code", element: <LinkPage /> },  // stats page

      { path: "/:code", element: <RedirectLink /> },   // short URL redirect

      { path: "/", element: <Dashboard /> },           // homepage (must be last)
    ],
  },
]);


function App() {
  return <RouterProvider router={router} />;
}

export default App;
