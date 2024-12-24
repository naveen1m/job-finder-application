import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "graphql-tag";
import { useNavigate, useParams } from "react-router-dom";
import { toast, Slide } from "react-toastify";

// GraphQL Queries and Mutations
const GET_JOB_BY_ID = gql`
  query GetJobById($id: ID!) {
    getJobById(id: $id) {
      id
      title
      company
      description
      ctc
      location
    }
  }
`;

const APPLY_FOR_JOB = gql`
  mutation ApplyForJob($jobId: ID!) {
    applyForJob(jobId: $jobId) {
      id
      userId
      status
    }
  }
`;

const HAS_USER_APPLIED_FOR_JOB = gql`
  query hasUserAppliedForJob($jobId: ID!) {
    hasUserAppliedForJob(jobId: $jobId)
  }
`;

const JobDetails = () => {
  const { jobId } = useParams();
  const [applicationStatus, setApplicationStatus] = useState(null);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isSeeker = role === "seeker";

  const {
    loading: appliedLoading,
    error: appliedError,
    data: appliedData,
    refetch,
  } = useQuery(HAS_USER_APPLIED_FOR_JOB, {
    variables: { jobId },
  });
  const isalreadyApplied = appliedData?.hasUserAppliedForJob;
  const [alreadyApplied, setAlreadyApplied] = useState(isalreadyApplied);
  refetch();

  console.log("applied", isalreadyApplied, alreadyApplied);
  // setAlreadyApplied(isalreadyApplied);
  const navigate = useNavigate();

  // Fetch job details
  const { loading, error, data } = useQuery(GET_JOB_BY_ID, {
    variables: { id: jobId },
  });

  // Mutation for applying to a job
  const [applyForJob] = useMutation(APPLY_FOR_JOB, {
    onCompleted: (data) => {
      setApplicationStatus(data.applyForJob.status);
    },
    onError: (error) => {
      console.error("Error applying for job:", error);
    },
  });

  const handleApply = async () => {
    if (!token) {
      toast.info("Login first!", { transitiion: Slide });
      navigate("/login");
    } else {
      await applyForJob({ variables: { jobId } });
      toast.success("Applied!", { transition: Slide });
      setAlreadyApplied(true);
      navigate("/jobs");
    }
  };

  if (loading) return <p className="animate-pulse">Loading job details...</p>;
  if (error) return <p>Error loading job details. Please try again later.</p>;

  const job = data.getJobById;

  return (
    <div className="w-full min-h-screen bg-[#FAF9F6] flex justify-center items-center py-8 pt-16">
      <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{job.title}</h1>

        {/* Job Information */}
        <div className="space-y-6">
          <div className="p-6 border-l-4 border-blue-500 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="font-semibold text-lg text-gray-700">Location</h2>
            <p className="text-gray-600">{job.location}</p>
          </div>
          <div className="p-6 border-l-4 border-blue-500 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="font-semibold text-lg text-gray-700">Company</h2>
            <p className="text-gray-600">{job.company}</p>
          </div>
          <div className="p-6 border-l-4 border-blue-500 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="font-semibold text-lg text-gray-700">ctc</h2>
            <p className="text-gray-600">₹{job.ctc}</p>
          </div>
          <div className="p-6 border-l-4 border-blue-500 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="font-semibold text-lg text-gray-700">Description</h2>
            <p className="text-gray-600">{job.description}</p>
          </div>
        </div>

        {/* Apply Button */}
        {isSeeker && (
          <button
            disabled={alreadyApplied || isalreadyApplied}
            onClick={handleApply}
            className={`mt-6 px-6 py-3 ${
              alreadyApplied || isalreadyApplied ? "bg-gray-400" : "bg-blue-600"
            } text-white rounded-lg text-lg w-full transition-all duration-200 hover:${
              alreadyApplied || isalreadyApplied ? "bg-gray-500" : "bg-blue-700"
            } ${
              alreadyApplied || isalreadyApplied
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            {alreadyApplied || isalreadyApplied
              ? "Already Applied"
              : "Apply for Job"}
          </button>
        )}

        {/* Application Status */}
        {applicationStatus && (
          <p className="mt-4 text-green-600 text-lg font-semibold">
            Application status: {applicationStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
