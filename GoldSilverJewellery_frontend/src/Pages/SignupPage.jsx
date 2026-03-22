import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../api/axios";
import rightimg from "../assets/bg1.jpg";
import { GoogleLogin } from "@react-oauth/google";
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
        localStorage.setItem("user", JSON.stringify(response.data.user));
        alert("Registration successfull!");
        localStorage.setItem("isLoggedIn", "true");
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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axiosInstance.post("/api/google", {
        credential: credentialResponse.credential,
      });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("isLoggedIn", "true");
        alert("Registration Successful");
        navigate("/");
      }
    } catch (err) {
      setError(
        err.message?.data?.message || "Google signup failed. Please try again",
      );
    }
  };
  return (
    <div className="min-h-[75vh] flex justify-content-center align-items-center t-0">
      <div className="w-full max-w-[950px] flex items-center m-auto gap-2 border-1 border-amber-500 shadow-xl p-5">
        <div className="rightside w-1/2 ">
          <img className="rounded-xs" src={rightimg} alt="" />
        </div>
        <div className="leftside bg-white w-1/2 p-8 rounded-2xl shadow-amber-100 animate-[slideUp_0.5s_ease-out_forwards] align-items-center">
          <form onSubmit={handleSubmit} className="mb-5 flex flex-wrap gap-3">
            <div className="flex flex-col gap-0">
              <label
                htmlFor="username"
                className="text-md text-amber-950 font-light"
              >
                Username
              </label>
              <input
                className="w-44 border-b-2 border-gray-400 duration-300 focus:outline-0"
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              ></input>
            </div>
            <div className="form-group flex flex-col gap-0 ">
              <label
                htmlFor="username"
                className="text-md text-amber-950 font-light"
              >
                Mobile Number
              </label>
              <input
                className="w-44 border-b-2 border-gray-400 duration-300 focus:outline-0"
                type="text"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                maxLength="10"
                required
              ></input>
            </div>
            <div className="form-group flex flex-col gap-0 ">
              <label
                htmlFor="username"
                className="text-md text-amber-950 font-light"
              >
                Create Password
              </label>
              <input
                className="w-96  border-b-2 border-gray-400 duration-300 focus:outline-0"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              ></input>
            </div>
            <div className="form-group flex flex-col gap-0">
              <label
                htmlFor="username"
                className="text-md text-amber-950 font-light"
              >
                Confirm Password
              </label>
              <input
                className="w-96 border-b-2 font-extralight border-gray-400 focus:outline-0 duration-300"
                type="password"
                id="confirmpassword"
                name="confirmPassword"
                placeholder="min 6 characters"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              ></input>
            </div>
            {error && (
              <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="p-2 btn-primary bg-yellow-600 text-amber-100 font-bold text-lg 
            mt-10 w-44 border-2 rounded-lg align-items-center 
            transition-all 
               disabled:opacity-50 
               hover:enabled:-translate-y-0.5 
               hover:enabled:shadow-[0_6px_20px_rgba(245,175,25,0.4)]"
              disabled={loading}
            >
              {loading ? "Creating Account" : "Sign Up"}
            </button>
          </form>
          <div className="flex items-center gap-3 my-3 w-full">
            <hr className="flex-1 border-gray-300" />
            <span className="text-sm text-gray-400 font-light">
              or sign up with
            </span>
            <hr className="flex-1 border-gray-300" />
          </div>
          <div className="flex justify-center mt-2">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-up failed")}
              text="signup_with"
              shape="rectangular"
              theme="outline"
            />
          </div>

          <p className="t-0 switch-auth text-sm font-extralight">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login here</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
