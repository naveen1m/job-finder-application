import React from "react";
import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import { useNavigate } from "react-router-dom";

// GraphQL Query to Fetch Jobs Posted by Poster
const GET_JOBS_POSTED_BY_POSTER = gql`
  query GetJobsPostedByPoster {
    getJobsPostedByPoster {
      id
      title
      company
      location
      ctc
      description
    }
  }
`;

const JobsPosted = () => {
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_JOBS_POSTED_BY_POSTER);

  if (loading) return <p>Loading jobs posted by you...</p>;
  if (error) return <p>Error fetching jobs. Please try again later.</p>;

  const jobs = data?.getJobsPostedByPoster || [];

  return (
    <div className="p-8 bg-gray-100 min-h-screen ">
      <div className="max-w-4xl  min-w-6 mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Jobs Posted by You
        </h1>
        {jobs.length > 0 ? (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-black">
                  #
                </th>
                <th className="border border-gray-300 px-4 py-2 text-black">
                  Job Title
                </th>
                <th className="border border-gray-300 px-4 py-2 text-black">
                  Company
                </th>
                <th className="border border-gray-300 px-4 py-2 text-black">
                  Location
                </th>
                <th className="border border-gray-300 px-4 py-2 text-black">
                  ctc
                </th>
                <th className="border border-gray-300 px-4 py-2 text-black">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, idx) => (
                <tr key={idx} className="text-center">
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    {idx + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    {job.title}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    {job.company}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    {job.location}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    {job.ctc ? `$${job.ctc}` : "Not Disclosed"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    <button
                      onClick={() => navigate(`/jobs/applicants/${job.id}`)}
                      className="bg-blue-600 px-4 py-2 text-white rounded-md"
                    >
                      View Applicants
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No jobs posted yet.</p>
        )}
      </div>
    </div>
  );
};

export default JobsPosted;
