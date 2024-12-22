import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "graphql-tag";
import { useNavigate, useParams } from "react-router-dom";

// GraphQL Query to Fetch Applicants for a Job
const GET_JOB_APPLICANTS = gql`
  query GetJobApplicants($jobId: ID!) {
    getJobApplicants(jobId: $jobId) {
      id
      status
      userId
    }
  }
`;

// GraphQL Mutation to Update Applicant Status
const UPDATE_APPLICANT_STATUS = gql`
  mutation updateApplicationStatus($applicationId: ID!, $status: String!) {
    updateApplicationStatus(applicationId: $applicationId, status: $status) {
      id
      status
    }
  }
`;

const JobApplicants = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const { loading, error, data } = useQuery(GET_JOB_APPLICANTS, {
        variables: { jobId },
    });

    const [updateApplicationStatus] = useMutation(UPDATE_APPLICANT_STATUS);

    if (loading) return <p>Loading applicants...</p>;
    if (error) return <p>Error fetching applicants. Please try again later.</p>;

    const applicants = data?.getJobApplicants || [];

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Job Applicants</h1>

                {applicants.length > 0 ? (
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2 text-black">Application ID</th>
                                <th className="border border-gray-300 px-4 py-2 text-black">Applicant ID</th>
                                <th className="border border-gray-300 px-4 py-2 text-black">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicants.map((applicant, idx) => (
                                <tr key={idx} className="text-center">
                                    <td className="border border-gray-300 px-4 py-2 text-gray-700">{applicant.id}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-gray-700">{applicant.userId}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-gray-700 ">{applicant.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No applicants for this job yet.</p>
                )}
            </div>
        </div>
    );
};

export default JobApplicants;
