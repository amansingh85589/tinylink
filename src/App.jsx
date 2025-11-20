import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import AppLayout from "./layouts/app-layout";
import Dashboard from "./pages/dashboard";
import LinkPage from "./pages/link.jsx";

import RedirectLink from "./pages/redirect-link";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Dashboard /> },          // dashboard
      { path: "/code/:code", element: <LinkPage /> }, // stats page
      { path: "/:code", element: <RedirectLink /> },  // redirect
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
