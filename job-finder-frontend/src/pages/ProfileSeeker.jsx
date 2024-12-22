import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from 'graphql-tag';
import { useNavigate } from 'react-router-dom';

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
    updateUserProfile(id : $id,username: $username, email: $email) {
      id
      username
      email
    }
  }
`;

const GET_JOBS_APPLIED_BY_SEEKER = gql`
  query GetJobsAppliedBySeeker {
    getJobsAppliedBySeeker {
      id
      jobId
      userId
      status
    }
  }
`;



const ProfileSeeker = () => {

    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");

    const { loading, error, data, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: userId },
    });

    const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE);

    const { loading: jobsLoading, error: jobsError, data: jobsData } = useQuery(GET_JOBS_APPLIED_BY_SEEKER);

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

    if (jobsLoading) return <p>Loading applied jobs...</p>;
    if (jobsError) return <p>Error loading applied jobs. Please try again later.</p>;

    const appliedJobs = jobsData.getJobsAppliedBySeeker;


    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>
                {isEditing ? (
                    <div className="space-y-4">
                        <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
                            <label className="font-semibold text-gray-700 text-lg">Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
                            <label className="font-semibold text-gray-700 text-lg">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleCancel}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
                            <h2 className="font-semibold text-gray-700 text-lg">Username:</h2>
                            <p className="text-gray-600">{user.username}</p>
                        </div>
                        <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
                            <h2 className="font-semibold text-gray-700 text-lg">Email:</h2>
                            <p className="text-gray-600">{user.email}</p>
                        </div>
                        <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
                            <h2 className="font-semibold text-gray-700 text-lg">Role:</h2>
                            <p className="text-gray-600">{user.role}</p>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleEdit}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {/* Applied Job Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Applied Jobs</h2>
                {appliedJobs && appliedJobs.length > 0 ? (
                    <div className="space-y-4">
                        {appliedJobs.map((job) => (
                            <div key={job.jobId} className="p-4 border border-gray-300 rounded-md bg-gray-50">
                                <div className="grid grid-cols-3 gap-4 justify-items-end">
                                    <p className="text-lg text-gray-600" >{job.jobId}</p>
                                    <h3 className="text-lg font-semibold" >Status: {job.status}</h3>
                                    <button
                                        onClick={() => {
                                            navigate(`/jobs/${job.jobId}`, {
                                                state: { status: job.status },
                                            })
                                        }}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No applied jobs found.</p>
                )}
            </div>
        </div>
    );
};

export default ProfileSeeker;
