import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { toast, Slide } from "react-toastify";

// GraphQL Signup Mutation
const SIGNUP_MUTATION = gql`
  mutation SignUp(
    $username: String!
    $email: String!
    $password: String!
    $role: String!
  ) {
    signUp(
      signUpInput: {
        username: $username
        email: $email
        password: $password
        role: $role
      }
    ) {
      id
      username
      email
      token
    }
  }
`;

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "seeker", // Default role
  });
  const [isEmpty, setIsEmpty] = useState(false);

  const [signUp, { loading, error }] = useMutation(SIGNUP_MUTATION);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.role
    ) {
      setIsEmpty(true);
    }
    try {
      const { data } = await signUp({ variables: formData });
      console.log("Signup Successful:", data.signUp);

      toast.success("Please login!", { transition: Slide });
      // navigate to login
      window.location.href = "/login";
    } catch (err) {
      console.error("Signup Error:", err);
      toast.error("Oops! try again.", { transition: Slide });
    }
  };

  //   const notify = () =>
  //     toast.promise(
  //       handleSubmit,
  //       {
  //         pending: "wait for few seconds",
  //         success: "please login!",
  //         error: "Oops!",
  //       },
  //       { transition: Slide }
  //     );
  return (
    <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center text-gray-700">Sign Up</h2>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="mt-1 block w-full p-2 border border-gray-300  bg-white text-black rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
          >
            <option value="seeker">Job Seeker</option>
            <option value="poster">Job Poster</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          disabled={loading}
          onClick={notify}
        >
          {loading && !isEmpty ? "Signing up..." : "Sign Up"}
        </button>
        {isEmpty && <p className="text-red-500">All fields are required!</p>}
      </form>
      <p className="mt-4 text-sm text-center text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;
