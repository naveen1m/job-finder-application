import React from "react";
import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";

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

const JobsPostedByPoster = () => {
  const { loading, error, data } = useQuery(GET_JOBS_POSTED_BY_POSTER);

  if (loading) return <p>Loading jobs posted by you...</p>;
  if (error) return <p>Error fetching jobs. Please try again later.</p>;

  const jobs = data?.getJobsPostedByPoster || [];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Jobs Posted by You
        </h1>
        {jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-4 border border-gray-300 rounded-md bg-gray-50"
              >
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-600">
                  <strong>Company:</strong> {job.company}
                </p>
                <p className="text-gray-600">
                  <strong>Location:</strong> {job.location}
                </p>
                <p className="text-gray-600">
                  <strong>ctc:</strong> {job.ctc}
                </p>
                <p className="text-gray-600">
                  <strong>Description:</strong> {job.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No jobs posted yet.</p>
        )}
      </div>
    </div>
  );
};

export default JobsPostedByPoster;
