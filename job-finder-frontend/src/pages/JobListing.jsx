import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import { useNavigate } from "react-router-dom";
import JobCard from "./../components/JobCard";

const JOB_LISTINGS_QUERY = gql`
  query GetJobs($location: String, $ctcRange: String) {
    getJobs(location: $location, ctcRange: $ctcRange) {
      id
      title
      company
      description
      ctc
      location
    }
  }
`;

const JobListing = () => {
  const [filters, setFilters] = useState({
    location: "",
    minCTC: "",
    maxCTC: "",
  });
  const [locationFilter, setLocationFilter] = useState(null);
  const [jobResults, setJobResults] = useState([]);

  const { loading, error, data, refetch } = useQuery(JOB_LISTINGS_QUERY, {
    variables: {},
    onCompleted: (data) => {
      setJobResults(data.getJobs);
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    handleApplyFilters();
  }, [locationFilter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "minCTC" || name === "maxCTC") {
      const regex = /^[0-9]*\.?[0-9]*$/;
      if (regex.test(value)) {
        setFilters({ ...filters, [name]: value });
      }
    } else {
      setFilters({ ...filters, [name]: value });
      setLocationFilter(value);
    }
  };

  const handleApplyFilters = async () => {
    // console.log(filters);
    try {
      const { data } = await refetch({
        location: filters.location || null,
        ctcRange: `${filters.minCTC || 0}-${filters.maxCTC || 1000000000}`,
      });
      setJobResults(data.getJobs);
    } catch (error) {
      console.error("Error fetching filtered jobs:", error);
    }
  };

  if (loading) return <p className="animate-pulse">Loading jobs...</p>;
  if (error) return <p>Error loading jobs. Please try again later.</p>;

  return (
    <div className="p-6 bg-[#FAF9F6] min-h-screen pt-20">
      {/* <h1 className="text-3xl font-bold mb-4 text-gray-700">Job Listings</h1> */}

      <div className="mb-6 bg-white p-4 rounded-md shadow-md grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="w-full md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Enter location"
            className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700">
            Min Salary
          </label>
          <input
            type="text"
            name="minCTC"
            value={filters.minCTC}
            onChange={handleFilterChange}
            placeholder="Enter min salary"
            className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700">
            Max Salary
          </label>
          <input
            type="text"
            name="maxCTC"
            value={filters.maxCTC}
            onChange={handleFilterChange}
            placeholder="Enter max salary"
            className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>

        <div className="w-full md:col-span-1">
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ease-in delay-150 duration-200 w-full"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {jobResults.length === 0 ? (
        <p className="text-gray-500">No jobs available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobResults.map((job, idx) => {
            return <JobCard key={idx} job={job} />;
          })}
        </div>
      )}
    </div>
  );
};

export default JobListing;
