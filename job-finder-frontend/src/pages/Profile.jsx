import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from 'graphql-tag';
import { useNavigate } from 'react-router-dom';
import JobsApplied from "./JobsApplied"
import JobsPosted from "./JobsPosted"

// GraphQL Query to Fetch User by ID
const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      username
      email
      role
    }
  }
`;

// GraphQL Mutation to Update User Profile
const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($id: ID!, $username: String!, $email: String!) {
    updateUserProfile(id : $id, username: $username, email: $email) {
      id
      username
      email
    }
  }
`;

const ProfilePage = () => {

  const userId = localStorage.getItem("userId");

  const { loading, error, data, refetch } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
  });

  const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
    if (data?.getUserById) {
      setFormData({
        username: data.getUserById.username,
        email: data.getUserById.email,
      });
    }
  };

  const handleSave = async () => {
    try {
      await updateUserProfile({
        variables: {
          id: userId,
          username: formData.username,
          email: formData.email,
        },
      });
      setIsEditing(false);
      refetch(); // Refetch the user details after updating
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ username: "", email: "" });
  };

  if (loading) return <p>Loading your profile...</p>;
  if (error) return <p>Error loading profile. Please try again later.</p>;

  const user = data.getUserById;

  const { role } = user;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="w-full mx-auto bg-white p-8 rounded-2xl shadow-xl max-w-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-extrabold text-gray-800">Your Profile</h1>
          <button
            onClick={handleEdit}
            className="bg-blue-600 text-white p-3 rounded-3xl text-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Edit Profile
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-6">
            <div className="p-6 border border-gray-300 rounded-xl bg-gray-100 shadow-md hover:shadow-xl transition-shadow">
              <label className="font-semibold text-gray-700 text-xl">Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="mt-3 p-4 border border-gray-300 bg-white text-black rounded-xl w-full text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="p-6 border border-gray-300 rounded-xl bg-gray-100 shadow-md hover:shadow-xl transition-shadow">
              <label className="font-semibold text-gray-700 text-xl">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-3 p-4 border border-gray-300 bg-white text-black rounded-xl w-full text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-full text-lg shadow-md hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg shadow-md hover:bg-blue-700 transition duration-300"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 w-[450px]">
            <div className="p-6 border border-gray-300 rounded-xl bg-gray-100 shadow-md hover:shadow-xl transition-shadow ">
              <h2 className="font-semibold text-gray-700 text-xl">Username:</h2>
              <p className="text-gray-600 text-lg">{user.username}</p>
            </div>
            <div className="p-6 border border-gray-300 rounded-xl bg-gray-100 shadow-md hover:shadow-xl transition-shadow ">
              <h2 className="font-semibold text-gray-700 text-xl">Email:</h2>
              <p className="text-gray-600 text-lg">{user.email}</p>
            </div>
            <div className="p-6 border border-gray-300 rounded-xl bg-gray-100 shadow-md hover:shadow-xl transition-shadow ">
              <h2 className="font-semibold text-gray-700 text-xl">Role:</h2>
              <p className="text-gray-600 text-lg">{user.role}</p>
            </div>
          </div>
        )}

      </div>
      {
        role === "seeker" ? <JobsApplied /> : <JobsPosted />
      }
    </div>
  );
};

export default ProfilePage;
