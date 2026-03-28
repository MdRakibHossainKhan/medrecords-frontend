import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PatientDetail() {
    const location = useLocation();
    const navigate = useNavigate();

    // grab initial data from router
    const patientData = location.state?.patient;

    // local states for editing
    const [patient, setPatient] = useState(patientData);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editForm, setEditForm] = useState(patientData?.profile || {});

    if (!patient) return <div className="p-10 text-center">No patient data found.</div>;

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSaveEdit = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/update-patient", {
                method: "PUT",
                headers: { "Content-Type": "application/json", "x-role": "doctor", "x-sub": "demo-sub" },
                body: JSON.stringify(editForm),
            });

            if (response.ok) {
                // update local UI to match saved data without refreshing
                setPatient({ ...patient, profile: editForm });
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Update failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to permanently delete this patient record?")) return;

        try {
            const response = await fetch(`http://localhost:8080/delete-patient/${patient.profile.PatientID}`, {
                method: "DELETE",
                headers: { "x-role": "doctor", "x-sub": "demo-sub" }
            });

            if (response.ok) navigate("/dashboard");
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const { profile, activePrescriptions, recentRecords } = patient;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-4xl">

                {/* top navigation & actions */}
                <div className="mb-6 flex items-center justify-between">
                    <button onClick={() => navigate("/dashboard")} className="text-sm font-semibold text-blue-600 hover:underline">
                        &larr; Back to Registry
                    </button>
                    <div className="space-x-3">
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="rounded border px-4 py-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100">
                                Edit Patient
                            </button>
                        ) : (
                            <button onClick={() => { setIsEditing(false); setEditForm(profile); }} className="rounded border px-4 py-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100">
                                Cancel
                            </button>
                        )}
                        <button onClick={handleDelete} className="rounded bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700">
                            Delete Record
                        </button>
                    </div>
                </div>

                {/* profile card */}
                <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    {isEditing ? (
                        // --- EDIT MODE UI ---
                        <div className="space-y-4">
                            <input type="text" name="FullName" value={editForm.FullName} onChange={handleEditChange} className="w-full border-b text-3xl font-bold text-gray-800 outline-none focus:border-blue-500" />
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div><label className="text-xs text-gray-500">Age</label><input type="number" name="Age" value={editForm.Age} onChange={handleEditChange} className="w-full border rounded p-1" /></div>
                                <div><label className="text-xs text-gray-500">Blood Type</label><input type="text" name="BloodType" value={editForm.BloodType} onChange={handleEditChange} className="w-full border rounded p-1" /></div>
                                <div><label className="text-xs text-gray-500">Weight (kg)</label><input type="number" name="Weight" value={editForm.Weight} onChange={handleEditChange} className="w-full border rounded p-1" /></div>
                                <div><label className="text-xs text-gray-500">Condition</label><input type="text" name="PrimaryCondition" value={editForm.PrimaryCondition} onChange={handleEditChange} className="w-full border rounded p-1" /></div>
                            </div>
                            <button onClick={handleSaveEdit} disabled={loading} className="mt-4 rounded bg-green-600 px-6 py-2 text-white font-semibold hover:bg-green-700">
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    ) : (
                        // --- VIEW MODE UI ---
                        <>
                            <h1 className="text-3xl font-bold text-gray-800">{profile.FullName}</h1>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <p><span className="font-semibold text-gray-800">Patient ID:</span> {profile.PatientID}</p>
                                <p><span className="font-semibold text-gray-800">Age:</span> {profile.Age}</p>
                                <p><span className="font-semibold text-gray-800">Blood Type:</span> {profile.BloodType || "N/A"}</p>
                                <p><span className="font-semibold text-gray-800">Weight:</span> {profile.Weight ? `${profile.Weight} kg` : "N/A"}</p>
                                <p className="col-span-2"><span className="font-semibold text-gray-800">Primary Condition:</span> {profile.PrimaryCondition || "N/A"}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* medical history sections (read only for MVP) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 border-b pb-2 text-xl font-bold text-gray-800">Recent Records</h2>
                        {recentRecords?.length === 0 ? <p className="text-sm text-gray-500">No records found.</p> : null}
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 border-b pb-2 text-xl font-bold text-gray-800">Active Prescriptions</h2>
                        {activePrescriptions?.length === 0 ? <p className="text-sm text-gray-500">No prescriptions found.</p> : null}
                    </div>
                </div>

            </div>
        </div>
    );
}