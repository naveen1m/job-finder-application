import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';

// GraphQL Login Mutation
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      username
      email
      role
      token
    }
  }
`;

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login({ variables: formData });
            console.log('Login Successful:', data.login);

            // Save token or handle authentication logic
            localStorage.clear()

            localStorage.setItem("userId", data.login.id)
            localStorage.setItem("token", data.login.token)
            localStorage.setItem("role", data.login.role)

            navigate("/jobs")

        } catch (err) {
            console.error('Login Error:', err);
        }
    };

    return (
        <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
            {error && <p className="text-red-500 text-sm">{error.message}</p>}
            <form className="mt-6" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black rounded-md focus:ring focus:ring-blue-200 focus:outline-none "
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p className="mt-4 text-sm text-center text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-500 hover:underline">
                    Sign Up
                </Link>
            </p>
        </div>
    );
};

export default Login;
