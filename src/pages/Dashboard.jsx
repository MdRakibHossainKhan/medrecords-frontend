import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    // init state
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    // run once on load
    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            // fetch directly from backend port 8080
            const response = await fetch("http://localhost:8080/all-aggregated", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-role": "doctor", // pass auth role
                    "x-sub": "demo-sub" // pass auth sub
                }
            });

            if (response.ok) {
                const data = await response.json();
                // log and set data
                console.log("Fetched real AWS data:", data);
                setPatients(data);
            } else {
                console.error("Failed to fetch patients. Status:", response.status);
            }
        } catch (error) {
            console.error("Network error:", error);
        } finally {
            // stop loader
            setLoading(false);
        }
    };

    const handleLogout = () => {
        // clear token and exit
        localStorage.removeItem("medrecords_token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* nav bar */}
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

            {/* main content */}
            <main className="mx-auto mt-8 max-w-6xl p-4">
                {/* header */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-800">Patient Registry</h2>
                    <button
                        onClick={() => navigate("/add-patient")}
                        className="rounded-md bg-green-600 px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-green-700"
                    >
                        + Add New Patient
                    </button>
                </div>

                {/* table */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading patient data from AWS...</div>
                    ) : (
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="border-b border-gray-200 bg-gray-100 text-gray-800">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Patient Name</th>
                                    <th className="px-6 py-4 font-semibold">Age</th>
                                    <th className="px-6 py-4 font-semibold">Primary Condition</th>
                                    <th className="px-6 py-4 font-semibold">Date Added</th>
                                    <th className="px-6 py-4 font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {patients.map((patient) => (
                                    <tr key={patient.PatientID} className="transition-colors hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{patient.profile.FullName}</td>
                                        <td className="px-6 py-4">{patient.profile.Age}</td>
                                        <td className="px-6 py-4">{patient.profile.PrimaryCondition || "N/A"}</td>
                                        <td className="px-6 py-4">
                                            {patient.profile.CreatedAt
                                                ? new Date(patient.profile.CreatedAt).toLocaleDateString()
                                                : "N/A"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => navigate(`/patient/${patient.PatientID}`, { state: { patient } })}
                                                className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                View File
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* empty state */}
                    {!loading && patients.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No patients found in the database. Click "Add New Patient" to get started.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}