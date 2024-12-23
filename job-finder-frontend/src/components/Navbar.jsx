import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const isSeeker = role === "seeker";

  return (
    <div className="navbar fixed bg-white px-4 shadow-lg rounded-lg z-50 ">
      <div className="flex items-center space-x-2">
        <img src="/icon.png" alt="logo" className="h-8 w-8" />
        <h1
          className="text-xl font-extrabold text-gray-800 cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          Job Board
        </h1>
      </div>

      <div className="flex items-center space-x-4 ml-auto">
        <div className="flex justify-end">
          <button
            onClick={() => {
              navigate(!token ? "/login" : isSeeker ? "/jobs" : "/jobs/post");
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ease-in delay-150 duration-200"
          >
            {!token ? "Sign in" : isSeeker ? "View Jobs" : "Post Job"}{" "}
          </button>
        </div>

        {/* Profile Icon */}
        {token && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full hover:border-stone-900 ">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a
                  className="justify-between text-black"
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  Profile
                </a>
              </li>
              {token && (
                <li className="text-black">
                  <a
                    onClick={() => {
                      localStorage.clear();

                      navigate("/");
                      window.location.reload();
                    }}
                  >
                    Logout
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
