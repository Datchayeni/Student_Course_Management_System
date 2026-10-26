import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api"; // Adjust to your actual Axios client path if needed (e.g., ../api/apiClient)
import "../App.css"; // Or your specific stylesheet

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      // Calls POST /api/v1/auth/login through Axios
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const result = response.data;

      // Save the returned JWT token to session storage
      sessionStorage.setItem("token", result.token);
      
      setMessage(result.message || "Login successful");
      console.log("Logged-in student:", result.student);

      // Clear password field for security
      setPassword("");

      // Optional: Redirect to dashboard or home page after a short delay
      setTimeout(() => {
        navigate("/student-dashboard"); // Change to your target dashboard route
      }, 1000);

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your email and password and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Student Login</h2>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="auth-button">
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && <p role="status" className="success-message">{message}</p>}
        {error && <p role="alert" className="error-message">{error}</p>}

        <p className="auth-redirect">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;