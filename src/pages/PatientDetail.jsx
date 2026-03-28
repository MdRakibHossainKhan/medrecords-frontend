import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PatientDetail() {
    const location = useLocation();
    const navigate = useNavigate();

    // grab data passed from dashboard
    const patient = location.state?.patient;

    // fallback if loaded directly
    if (!patient) {
        return (
            <div className="mt-20 text-center">
                <p>No patient data found.</p>
                <button onClick={() => navigate("/dashboard")} className="mt-4 text-blue-600 underline">Back to Dashboard</button>
            </div>
        );
    }

    const { profile, activePrescriptions, recentRecords, xrayRecords } = patient;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-4xl">
                {/* header */}
                <button onClick={() => navigate("/dashboard")} className="mb-6 text-sm font-semibold text-blue-600 hover:underline">
                    &larr; Back to Registry
                </button>

                <div className="mb-8 rounded-lg bg-white p-6 shadow-sm border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800">{profile.FullName}</h1>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <p><span className="font-semibold">Patient ID:</span> {profile.PatientID}</p>
                        <p><span className="font-semibold">Age:</span> {profile.Age}</p>
                        <p><span className="font-semibold">Blood Type:</span> {profile.BloodType || "N/A"}</p>
                        <p><span className="font-semibold">Weight:</span> {profile.Weight ? `${profile.Weight} kg` : "N/A"}</p>
                        <p className="col-span-2"><span className="font-semibold">Primary Condition:</span> {profile.PrimaryCondition || "N/A"}</p>
                    </div>
                </div>

                {/* sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* records */}
                    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Recent Records</h2>
                        {recentRecords.length === 0 ? <p className="text-sm text-gray-500">No recent records.</p> : (
                            <ul className="space-y-3">
                                {recentRecords.map(rec => (
                                    <li key={rec.RecordID} className="text-sm border-l-4 border-blue-500 pl-3">
                                        <p className="font-semibold">{rec.Date}</p>
                                        <p className="text-gray-600">{rec.Diagnosis}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* prescriptions */}
                    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Active Prescriptions</h2>
                        {activePrescriptions.length === 0 ? <p className="text-sm text-gray-500">No active prescriptions.</p> : (
                            <ul className="space-y-3">
                                {activePrescriptions.map(pre => (
                                    <li key={pre.RecordID} className="text-sm border-l-4 border-green-500 pl-3">
                                        <p className="font-semibold">{pre.Name}</p>
                                        <p className="text-gray-600">{pre.Dosage}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}