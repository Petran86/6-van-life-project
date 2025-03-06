import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { loginUser } from "../api";

export default function Login() {
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/host"; // keeps the path from which the user got redirected and send them back after logging in (combine with AuthRequired)

  function handleSubmit(e) {
    e.preventDefault();
    async function formSubmit() {
      setStatus("submitting");
      try {
        const data = await loginUser(loginFormData);
        console.log(data);
        setError(null);
        localStorage.setItem("loggedin", true);
        navigate(from, { replace: true }); // prop to fix the history stack so the user can go back to previous page and not the login page again (combine with AuthRequired)
      } catch (err) {
        setError(err);
      } finally {
        setTimeout(() => {
          setStatus("idle");
        }, 2000);
      }
    }
    formSubmit();
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const message = location.state?.message || "";

  return (
    <div className="login-container">
      <h3 className="login-error">{message}</h3>
      <h1>Sign in to your account</h1>
      {error?.message && <h3 className="login-error">{error.message}</h3>}
      <form onSubmit={handleSubmit} className="login-form">
        <input
          name="email"
          onChange={handleChange}
          type="email"
          placeholder="Email address"
          value={loginFormData.email}
        />
        <input
          name="password"
          onChange={handleChange}
          type="password"
          placeholder="Password"
          value={loginFormData.password}
        />
        <button disabled={status === "submitting"}>
          {status === "submitting" ? "Logging in..." : "Log in"}
        </button>
      </form>
    </div>
  );
}
