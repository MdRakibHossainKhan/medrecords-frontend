import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddPatient() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // State to hold our form data
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        condition: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Send the data to your Node.js backend
            const response = await fetch("http://localhost:8080/api/patients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // THESE ARE CRITICAL: They get you past the backend security middleware
                    "x-role": "doctor",
                    "x-sub": "demo-sub"
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log("Patient successfully sent to backend!");
                // Send the doctor back to the dashboard after a successful save
                navigate("/dashboard");
            } else {
                console.error("Failed to save patient. Server responded with an error.");
            }
        } catch (error) {
            console.error("Network error: Could not reach the backend.", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-8 shadow-md">
                <h2 className="mb-6 text-3xl font-bold text-gray-800">Add New Patient</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Patient Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border border-gray-300 p-2.5 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    {/* Age */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Age</label>
                        <input
                            type="number"
                            name="age"
                            required
                            min="0"
                            value={formData.age}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border border-gray-300 p-2.5 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g. 45"
                        />
                    </div>

                    {/* Primary Condition */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Primary Condition</label>
                        <input
                            type="text"
                            name="condition"
                            required
                            value={formData.condition}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border border-gray-300 p-2.5 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g. Hypertension"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="rounded-md px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:bg-blue-400"
                        >
                            {loading ? "Saving..." : "Save Patient"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}