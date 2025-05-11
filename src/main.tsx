import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import Loading from "./components/Loading.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <Suspense fallback={<Loading />}>
          <RouterProvider router={router} />
        </Suspense>
      </UserProvider>
    </AuthProvider>
  </StrictMode>
);
