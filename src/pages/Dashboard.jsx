import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    // Temporary dummy data so we can see the table layout!
    // We will replace this with real data from your Node.js backend later.
    const [patients, setPatients] = useState([
        { id: 1, name: "John Doe", age: 45, condition: "Hypertension", lastVisit: "2026-02-20" },
        { id: 2, name: "Jane Smith", age: 32, condition: "Type 2 Diabetes", lastVisit: "2026-02-22" },
        { id: 3, name: "Michael Johnson", age: 58, condition: "Asthma", lastVisit: "2026-02-25" },
    ]);

    const handleLogout = () => {
        localStorage.removeItem("medrecords_token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-blue-600 p-4 text-white shadow-md">
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-wide">MedRecords</h1>
                    <button
                        onClick={handleLogout}
                        className="rounded bg-blue-800 px-4 py-2 text-sm font-semibold transition-colors hover:bg-blue-900"
                    >
                        Log Out
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="mx-auto mt-8 max-w-6xl p-4">
                {/* Header and Action Button */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-800">Patient Registry</h2>
                    <button
                        onClick={() => navigate("/add-patient")}
                        className="rounded-md bg-green-600 px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-green-700">
                        + Add New Patient
                    </button>
                </div>

                {/* Patient Data Table */}
                <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-100 text-gray-800 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Patient Name</th>
                                <th className="px-6 py-4 font-semibold">Age</th>
                                <th className="px-6 py-4 font-semibold">Primary Condition</th>
                                <th className="px-6 py-4 font-semibold">Last Visit</th>
                                <th className="px-6 py-4 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {patients.map((patient) => (
                                <tr key={patient.id} className="transition-colors hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                                    <td className="px-6 py-4">{patient.age}</td>
                                    <td className="px-6 py-4">{patient.condition}</td>
                                    <td className="px-6 py-4">{patient.lastVisit}</td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 font-medium hover:text-blue-800 hover:underline">
                                            View File
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Fallback if the array is empty */}
                    {patients.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No patients found. Click "Add New Patient" to get started.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}