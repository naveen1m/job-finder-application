import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  return (
    <div className="min-h-screen w-screen flex">
      <div
        className="hero lg:bg-[url('/homepage.jpg')]  
      bg-[position:bottom_-1rem_center] bg-clip-content    md:bg-[#FAF9F6]"
      >
        <div className="hero-content text-center">
          <div className="max-w-md">
            <div className="backdrop-blur-sm bg-blend-overlay rounded-full bg-opacity-50 ">
              <h1
                className="text-6xl font-extrabold tracking-wide 
              subpixel-antialiased  leading-tight mb-4 text-[#f79256] brightness-100   "
              >
                {/* f79256 f79256 */}
                Empower Your Career Path!
              </h1>
            </div>
            <p className="text-lg mb-6 text-[#00171f]">
              Unlock limitless opportunities with our seamless job posting
              platform. From finding the right talent to managing applications
              effortlessly, we’ve got you covered.
            </p>
            <h2 className="text-xl font-extrabold leading-tight mb-4 text-gray-800">
              Your next great hire is just a click away... 🚀
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                className="btn btn-primary hover:bg-[#023e8a] hover:text-[#edf6f9] transition ease-in delay-150 duration-500"
                onClick={() => {
                  navigate(token ? "/jobs" : "/login");
                }}
              >
                Get Started
              </button>
              <button
                className="btn btn- text-[#edf6f9] transition ease-in delay-100 hover:bg-[#f79256] hover:text-gray-800 duration-500 "
                onClick={() => {
                  navigate("/jobs");
                }}
              >
                Explore Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
