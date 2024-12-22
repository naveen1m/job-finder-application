import React from "react"
import { useNavigate } from "react-router-dom";


const JobCard = ({ job }) => {

    const navigate = useNavigate()

    return (
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
            <p className="text-sm text-gray-500 mt-2 font-medium">{job.company}</p>
            <div className="mt-2 flex items-center text-sm text-gray-600">
                <span className="mr-2">📍 {job.location}</span>
                <span>💰 ${job.salary}</span>
            </div>
            <p className="text-sm text-gray-600 mt-3">{job.description}</p>
            <button
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg w-full text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all"
            >
                View Details
            </button>
        </div>
    );
};


export default JobCard