import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddPatient() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        condition: "",
        bloodType: "",
        weight: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/api/patients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-role": "doctor",
                    "x-sub": "auth-user-1"
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                navigate("/dashboard");
            } else {
                console.error("Submission failed");
            }
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-8 shadow-md">
                <h2 className="mb-6 text-3xl font-bold text-gray-800">Add New Patient</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border p-2 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Age</label>
                            <input
                                type="number"
                                name="age"
                                required
                                min="0"
                                value={formData.age}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border p-2 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Blood Type</label>
                            <select
                                name="bloodType"
                                value={formData.bloodType}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border p-2 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Select...</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                min="0"
                                value={formData.weight}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border p-2 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Primary Condition</label>
                            <input
                                type="text"
                                name="condition"
                                required
                                value={formData.condition}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border p-2 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
                        >
                            {loading ? "Saving..." : "Save Patient"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}