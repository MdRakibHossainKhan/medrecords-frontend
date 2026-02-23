import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import userPool from "../cognitoConfig";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!email || !password) {
            setError("Please enter both email and password.");
            setIsLoading(false);
            return;
        }

        // 1. Package the credentials
        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password,
        });

        // 2. Point to the specific user in our Pool
        const cognitoUser = new CognitoUser({
            Username: email,
            Pool: userPool,
        });

        // 3. Attempt to authenticate with AWS
        cognitoUser.authenticateUser(authDetails, {
            onSuccess: (result) => {
                console.log("AWS Login Successful!", result);
                const accessToken = result.getAccessToken().getJwtToken();
                localStorage.setItem("medrecords_token", accessToken);
                setIsLoading(false);
                navigate("/dashboard");
            },
            newPasswordRequired: (userAttributes, requiredAttributes) => {
                console.log("AWS demands a new password and a name!");

                // AWS needs the required 'name' attribute to finish setting up the account!
                const finalAttributes = {
                    name: "Admin", // Providing a default name to pass the security check
                };

                // We pass finalAttributes instead of userAttributes
                cognitoUser.completeNewPasswordChallenge(password, finalAttributes, {
                    onSuccess: (result) => {
                        console.log("Password and name updated successfully!", result);
                        const accessToken = result.getAccessToken().getJwtToken();
                        localStorage.setItem("medrecords_token", accessToken);
                        setIsLoading(false);
                        navigate("/dashboard");
                    },
                    onFailure: (err) => {
                        console.error("Password update failed:", err);
                        setError(err.message);
                        setIsLoading(false);
                    }
                });
            },
            onFailure: (err) => {
                console.error("AWS Login Failed:", err);
                setError(err.message || "Incorrect username or password.");
                setIsLoading(false);
            },
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h1 className="mb-6 text-center text-3xl font-bold text-blue-600">MedRecords</h1>
                <h2 className="mb-6 text-center text-xl text-gray-700">Doctor Portal Login</h2>

                {error && (
                    <div className="mb-4 rounded bg-red-100 p-3 text-center text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="doctor@hospital.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-md bg-blue-600 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {isLoading ? "Verifying..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}