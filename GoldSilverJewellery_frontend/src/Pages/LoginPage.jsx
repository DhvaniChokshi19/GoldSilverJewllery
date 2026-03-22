import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { GoogleLogin } from "@react-oauth/google";

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

    if (!formData.mobile || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/api/login", {
        mobile: formData.mobile,
        password: formData.password,
      });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        alert("LOGIN SUCCESSFUL");
        localStorage.setItem("isLoggedIn", "true");

        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed Please try again");
    } finally {
      setLoading(false);
    }
  };
const handleGoogleSuccess = async (credentialResponse) => {
  try{
    const response = await axiosInstance.post('/api/google',{
      credential: credentialResponse.credential,
    });
    if(response.data.success){
      localStorage.setItem("token",response.data.token);
      localStorage.setItem("user",JSON.stringify(response.data.user));
      localStorage.setItem("isLoggedIn",true);
      alert("Login Successful");
      navigate("/");
    }
  }catch(err){
    setError(err.response?.data?.message) || "Google Login failed";
  }
}
  return (
    <div className="min-h-[75vh] flex justify-content-center align-items-center t-0">
      <div className="w-[400px] h-auto flex flex-col px-5 m-auto gap-1 border-1 border-amber-500 bg-yellow-500/20 shadow-xl ">
        <h2 className="text-blue-500 text-3xl font-bold text-center">
          Welcome back
        </h2>
        <p className="text-black text-sm font-medium text-center mb-3">
          Login to your account
        </p>
        <form onSubmit={handleSubmit} className="mb-5 flex flex-col gap-3">
          <div className="flex flex-col gap-0">
            <label htmlFor="mobile" className="text-md text-black font-light">
              Mobile Number
            </label>
            <input
              className="w-full border-b-2 border-gray-400 duration-300 focus:outline-0"
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

          <div className="flex flex-col gap-0">
            <label htmlFor="password" className="text-md text-black font-light">
              Password
            </label>
            <input
              className="w-full border-b-2 border-gray-400 duration-300 focus:outline-0"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="p-2 btn-primary text-center align-items-center bg-amber-500 text-white font-bold text-lg 
            mt-10 w-55 border-2 rounded-lg  
            transition-all 
               disabled:opacity-50 
               hover:enabled:-translate-y-0.5 
               hover:enabled:shadow-[0_6px_20px_rgba(245,175,25,0.4)]"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="flex items-center gap-3 mb-3">
          <hr className="flex-1 border-gray-300" />
          <span className="text-sm text-gray-400 font-light">or login with</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* ── Google Button ── */}
        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google login failed")}
            text="signin_with"
            shape="rectangular"
            theme="outline"
          />
        </div>
        <p className="text-sm font-light">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign up here</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
