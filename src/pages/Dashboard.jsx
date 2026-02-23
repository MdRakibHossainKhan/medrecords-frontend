import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("medrecords_token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow">
                <div className="flex items-center justify-between border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                        Log Out
                    </button>
                </div>
                <p className="mt-6 text-gray-600">
                    Welcome to the secure MedRecords system. Patient list will go here!
                </p>
            </div>
        </div>
    );
}