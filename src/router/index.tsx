import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import UnProtectedRoute from "./UnProtectedRoute";

const App = lazy(() => import("../App"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Home = lazy(() => import("../pages/Home"));
const ChatRoom = lazy(() => import("../pages/ChatRoom"));
const NotFound = lazy(() => import("../pages/NotFound"));

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <App />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "chat/:chatId",
          element: <ChatRoom />,
        },
      ],
    },
    {
      path: "login",
      element: (
        <UnProtectedRoute>
          <Login />
        </UnProtectedRoute>
      ),
    },
    {
      path: "register",
      element: (
        <UnProtectedRoute>
          <Register />
        </UnProtectedRoute>
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  {
    basename: "/chat/",
  }
);
