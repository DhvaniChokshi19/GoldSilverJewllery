import React from "react";
import shoplogo from "../assets/header.png";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const handleLogout = () =>{
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    navigate("/");
  }
  return (
    <div className="header top-0 left-0 w-full z-50">
      <div className="top-header w-full bg-white ">
        <div className="w-full flex justify-center items-center">
          <Link to="/"><img className="w-full" src={shoplogo} alt="Shop Logo" /></Link>
        </div>
      </div>

      <nav className="navbar shadow px-3 py-2">
        <div className="w-full flex justify-center items-center">
          <ul className="flex gap-32">
            <li>
              <Link to="/" className="text-brown-400 font-medium text-xl">
                Collections
              </Link>
            </li>
            <li>
              <Link
                to="/goldjewellery"
                className="hover:text-brown-300 font-medium text-xl"
              >
               Gold Jewellery
              </Link>
            </li>
            <li>
              <Link
                to="/silverjewellery"
                className="hover:text-brown-300 font-medium text-xl"
              >
               Silver Jewellery
              </Link>
            </li>
            <li>
              <Link
                to="/customorder"
                className="hover:text-brown-300 font-medium text-xl"
              >
               Custom Order
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-brown-300 font-medium text-xl"
              >
                Our Shop
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button
                onClick={handleLogout}
                className="hover:text-brown-300 font-medium text-xl flex gap-3">
                  <span>Logout</span>
                  <LogOut className="mt-1"></LogOut>
                </button>
              ):(
                <Link
                to="/signup"
                className="hover:text-brown-300 font-medium text-xl flex gap-3">
                  <span>Signup</span>
                  <LogIn className="mt-1"></LogIn>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Header;
