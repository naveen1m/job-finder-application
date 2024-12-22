import React, { Fragment } from 'react';
import "./index.css"

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import JobList from './pages/JobListing';
import JobDetails from './pages/JobDetails';
import Profile from './pages/Profile';
import JobApplicants from './pages/JobApplicants';
import JobPost from './pages/JobPost';
import Hero from './pages/Hero';
import Navbar from "./components/Navbar"

const App = () => {
	return (
		<Router>
			<MainLayout />
		</Router>
	);
};

const MainLayout = () => {
	const location = useLocation();

	const showNavbar = !["/", '/login', '/signup'].includes(location.pathname);

	return (
		<>
			{showNavbar && <Navbar />}
			<div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-100">
				<Routes>
					<Route path="/" element={<Hero />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<SignUp />} />
					<Fragment>

						<Route path="/jobs" element={<JobList />} />
						<Route path="/jobs/:jobId" element={<JobDetails />} />
						<Route path="/jobs/applicants/:jobId" element={<JobApplicants />} />
						<Route path="/jobs/post" element={<JobPost />} />
						<Route path="/profile" element={<Profile />} />
					</Fragment>
				</Routes>
			</div>
		</>
	);
};

export default App;
