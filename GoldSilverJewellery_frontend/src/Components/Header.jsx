import React from "react";
import shoplogo from "../assets/header.png";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

const Header = () => {
  return (
    <div className="header top-0 left-0 w-full z-50">
      <div className="top-header w-full bg-white ">
        <div className="w-full flex justify-center items-center">
          <img className="w-full" src={shoplogo} alt="Shop Logo" />
        </div>
      </div>

      <nav className="navbar shadow px-3 py-2">
        <div className="w-full flex justify-center items-center">
          <ul className="flex gap-32">
            <li>
              <Link to="/" className="text-brown-400 font-medium text-xl">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/collections"
                className="hover:text-brown-300 font-medium text-xl"
              >
                Collections
              </Link>
            </li>
            <li>
              <Link
                to="/ourstory"
                className="hover:text-brown-300 font-medium text-xl"
              >
                Our Story
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
              <Link
                to="/signup"
                className="hover:text-brown-300 font-medium text-xl flex gap-3"
              >
                <span>Signup</span>
                <LogIn className="mt-1" />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Header;
