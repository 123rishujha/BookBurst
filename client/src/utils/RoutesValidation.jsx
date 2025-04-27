import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { userState } = useSelector((store) => store.user);
  const { pathname } = useLocation();

  if (!userState) {
    return <Navigate to="/login" state={{ pathname }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

export const PublicOnlyRoute = ({ children }) => {
  const { userState } = useSelector((store) => store.user);

  if (userState) {
    return <Navigate to={"/my-bookshelf"} />;
  }

  return <div>{children}</div>;
};
