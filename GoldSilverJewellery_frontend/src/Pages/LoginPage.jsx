import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/api/login", {
        mobile: formData.mobile,
        password: formData.password,
      });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        alert("LOGIN SUCCESSFUL");
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.manage || "Login failed Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginpage">
      <div className="loginconatiner">
        <div className="login box bg-amber-300/5 ">
          <h2 className="text-blue-800">Welcome back</h2>
          <p className="text-sm text-amber-50">Login to your account</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                type="text"
                id="mobile"
                name="mobile"
                placeholder="Enter 10-digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
                maxLength="10"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="signup-link">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")}>Sign up here</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
