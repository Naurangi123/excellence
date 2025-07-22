/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { getTodos } from '../services/apiServices';
import TodoApp from '../components/Todo';

const Dashboard = () => {


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">
                    Excellence Technologies
                    </div>
                <div className="space-x-4">
                    <a href="/" className="text-gray-300 hover:text-white">Home</a>
                    <a href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</a>
                    <a href="/todos" className="text-gray-300 hover:text-white">Todos</a>
                    <a href="/profile" className="text-gray-300 hover:text-white">Profile</a>
                    <a href="/logout" className="text-gray-300 hover:text-white">Logout</a>
                </div>
            </div>
        </nav>
    </div>
  )
}

export default Dashboard