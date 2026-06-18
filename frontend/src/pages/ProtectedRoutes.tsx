import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppState } from "../state";

export function ProtectedRoute() {
  const { currentUser, isAuthLoading } = useAppState();
  const location = useLocation();

  if (isAuthLoading) {
    return <div className="container mx-auto px-6 py-10">Loading...</div>;
  }

  if (!currentUser) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{
          from: location.pathname + location.search,
        }}
      />
    );
  }

  return <Outlet />;
}
