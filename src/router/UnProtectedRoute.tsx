import { type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";

interface Props {
  readonly children: ReactNode;
}

export default function UnProtectedRoute({ children }: Props) {
  const { currentUser: user, loading } = useAuth();

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );

  if (user) return <Navigate to="/" replace />;

  return <>{children}</>;
}
