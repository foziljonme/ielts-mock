import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, AlertCircle } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { FORGOT_PASSWORD_PATH, SIGNUP_PATH } from "../constants";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, redirectUrl } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate(redirectUrl);
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { email: "student@demo.com", role: "Student", password: "demo1234560" },
    { email: "teacher@demo.com", role: "Teacher", password: "demo1234560" },
    { email: "admin@demo.com", role: "Tenant Admin", password: "demo1234560" },
    { email: "saas@demo.com", role: "SaaS Admin", password: "demo1234560" },
  ];

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/uploads/merge", {
        method: "POST",
        body: new FormData(e.currentTarget),
      });
      console.log(response);
      // navigate(redirectUrl);
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleMultipleAudioSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      console.log(fileArray);
    }
  };

  return (
    <AuthLayout>
      <div>
        <h1>Upload Audio test</h1>
        <form
          onSubmit={handleUpload}
          method="post"
          encType="multipart/form-data"
        >
          <input
            type="file"
            name="files"
            multiple
            accept="audio/*"
            required
            onChange={handleMultipleAudioSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
          />
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            type="submit"
          >
            Upload
          </button>
        </form>
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              to={FORGOT_PASSWORD_PATH}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to={SIGNUP_PATH}
              className="text-blue-600 hover:text-blue-700"
            >
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-3 text-center">
            Demo Accounts:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => {
                  setEmail(account.email);
                  setPassword("demo");
                }}
                className="px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
              >
                {account.role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
