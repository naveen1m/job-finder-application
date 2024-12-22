import React from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {

    const navigate = useNavigate();

    return (
        <div className='min-h-screen w-screen flex'>
            <div className="hero bg-slate-400">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-6xl font-extrabold leading-tight mb-4 text-gray-800">
                            Empower Your Career Path!
                        </h1>
                        <p className="text-lg mb-6 text-gray-700">
                            Unlock limitless opportunities with our seamless job posting platform. From finding the right talent to managing applications effortlessly, we’ve got you covered.
                        </p>
                        <h2 className="text-xl font-extrabold leading-tight mb-4 text-gray-800">
                            Your next great hire is just a click away. 🚀
                        </h2>
                        <div className='grid grid-cols-2 gap-4'>
                            <button className="btn btn-primary" onClick={() => {
                                navigate("/login")
                            }}>Get Started</button>
                            <button className="btn btn-" onClick={() => {
                                navigate("/jobs")
                            }}>Explore Jobs</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>)
}

export default Hero