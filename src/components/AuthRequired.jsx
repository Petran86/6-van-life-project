import { Outlet, Navigate, useLocation } from "react-router";

export default function AuthRequired() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("loggedin");
  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        state={{ message: "You must log in first", from: location }} // keeps the path in location and saves it in URL state (combine with Login)
        replace // prop to fix the history stack so the user can go back to previous page and not the login page again (combine with Login)
      />
    );
  }
  return <Outlet />;
}
