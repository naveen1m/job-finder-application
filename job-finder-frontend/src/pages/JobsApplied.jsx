import React from "react";
import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import { useNavigate } from "react-router-dom";

// GraphQL Query to Fetch Jobs Applied by Seeker
const GET_JOBS_APPLIED_BY_SEEKER = gql`
  query GetJobsAppliedBySeeker {
    getJobsAppliedBySeeker {
      id
      jobId
      status
    }
  }
`;

const JobsApplied = () => {
    const navigate = useNavigate();

    const { loading, error, data } = useQuery(GET_JOBS_APPLIED_BY_SEEKER);

    if (loading) return <p>Loading applied jobs...</p>;
    if (error) return <p>Error fetching applied jobs. Please try again later.</p>;

    const appliedJobs = data?.getJobsAppliedBySeeker || [];

    return (
        <div className="p-8 px-2 bg-gray-100 min-h-screen">
            <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Applied Jobs</h1>
                {appliedJobs.length > 0 ? (
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2 text-black">#</th>
                                <th className="border border-gray-300 px-4 py-2 text-black">Job ID</th>
                                <th className="border border-gray-300 px-4 py-2 text-black">Status</th>
                                <th className="border border-gray-300 px-4 py-2 text-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appliedJobs.map((job, idx) => (
                                <tr key={job.id} className="text-center">
                                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{idx + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{job.jobId}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{job.status}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-gray-800">
                                        <button
                                            onClick={() => navigate(`/jobs/${job.jobId}`)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No jobs applied yet.</p>
                )}
            </div>
        </div>
    );
};

export default JobsApplied;
