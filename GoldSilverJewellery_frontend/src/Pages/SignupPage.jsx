import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../api/axios";
import rightimg from "../assets/bg1.jpg";
const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    password: "",
    confirmPassword: "",
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

    if (
      !formData.username ||
      !formData.mobile ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all details");
      setLoading(false);
      return;
    }
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long");
      setLoading(false);
      return;
    }

    // Validate password
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const response = await axiosInstance.post("/api/register", {
        username: formData.username,
        mobile: formData.mobile,
        password: formData.password,
      });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("token", JSON.stringify(response.data.user));
        alert("Registration successfull!");
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed Please Try Again",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="signup-page">
      <div className="sgnup-container ">
        <div className="rightside w-1/2">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              ></input>
            </div>
            <div className="form-group">
              <label htmlFor="username">Mobile Number</label>
              <input
                type="text"
                id="mobile"
                name="mobile"
                placeholder="Enter mobile number"
                value={formData.mobile}
                onChange={handleChange}
                maxLength="10"
                required
              ></input>
            </div>
            <div className="form-group">
              <label htmlFor="username">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                required
              ></input>
            </div>
            <div className="form-group">
              <label htmlFor="username">Confirm Password</label>
              <input
                type="password"
                id="confirmpassword"
                name="confirmpassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              ></input>
            </div>
            {error & <div className="error-message">{error}</div>}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating Account' : 'Sign Up'}
            </button>
          </form>

          <p className="switch-auth">
            Already have an account?{' '} 
            <span onClick={() => navigate('/login')}>Login here</span>
          </p>
        </div>
        <div className="leftside w-1/2">
          <img className="w-10 h-10" src={rightimg} alt="" />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
