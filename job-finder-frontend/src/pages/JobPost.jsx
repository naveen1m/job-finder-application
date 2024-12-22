import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "graphql-tag";
import { useNavigate } from "react-router-dom";

// GraphQL Mutation for Posting a Job
const POST_JOB = gql`
  mutation PostJob(
    $title: String!
    $company: String!
    $description: String!
    $ctc: Float!
    $location: String!
  ) {
    postJob(
      title: $title
      company: $company
      description: $description
      ctc: $ctc
      location: $location
    ) {
      id
      title
      company
      description
      ctc
      location
    }
  }
`;

const JobPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    ctc: "",
    location: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const [postJob] = useMutation(POST_JOB);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "ctc") {
      const regex = /^[0-9]*\.?[0-9]*$/;
      if (regex.test(value)) {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const { data } = await postJob({
        variables: {
          ...formData,
          ctc: parseInt(formData.ctc, 10), // Ensure ctc is sent as an integer
        },
      });
      setSuccessMessage(`Job posted successfully! ID: ${data.postJob.id}`);
      setFormData({
        title: "",
        company: "",
        description: "",
        ctc: "",
        location: "",
      });
      navigate("/profile");
    } catch (error) {
      setErrorMessage("Failed to post the job. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center text-gray-700">
        Post a Job
      </h2>
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter job title"
            required
            className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Enter company name"
            required
            className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter job description"
            required
            className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            rows="4"
          />
        </div>

        {/* ctc */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ctc ($)
          </label>
          <input
            type="text"
            name="ctc"
            value={formData.ctc}
            onChange={handleChange}
            placeholder="Enter ctc"
            required
            className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter job location"
            required
            className="mt-1 block w-full p-2 border border-gray-300 bg-white text-black rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Post Job
        </button>
      </form>

      {/* Success/Error Messages */}
      {successMessage && (
        <p className="text-green-500 mt-4 text-sm">{successMessage}</p>
      )}
    </div>
  );
};

export default JobPost;
