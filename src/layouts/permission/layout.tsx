import type { RootState } from "src/store";
import type { IRole } from "src/types/role";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRoles: IRole;
};

export function ProtectedRoute({
  children,
  requiredRoles,
}: ProtectedRouteProps) {
  const { loggedIn, profile, isLoadingRefresh } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    if (!token) {
      if (!loggedIn) {
        navigate("/");
      }
      if (requiredRoles !== profile.role) {
        navigate("/");
      }
    }
    if (loggedIn) {
      if (requiredRoles !== profile.role) {
        navigate("/");
      }
    }
  }, [profile, isLoadingRefresh, loggedIn, navigate, requiredRoles, token]);

  return <>{children}</>;
}
