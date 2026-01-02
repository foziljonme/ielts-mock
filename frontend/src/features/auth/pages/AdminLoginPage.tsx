import React, { useState } from "react";
import { Card } from "../../../shared/ui/card";
import { Button } from "../../../shared/ui/button";
import { Input } from "../../../shared/ui/input";
import { LogIn, GraduationCap } from "lucide-react";
import { Label } from "../../../shared/ui/label";
import { Alert, AlertDescription } from "../../../shared/ui/alert";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const { adminLogin, redirectUrl } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    adminLogin(email, password);
    navigate(redirectUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Admin Login</h1>
          <p className="text-gray-600">
            Enter your email and password to login
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@ielts.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="text-lg tracking-wider"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="admin"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="ext-lg tracking-wider"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" size="lg">
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t">
          <p className="text-xs text-gray-500 text-center">Demo Accounts:</p>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {["admin@ielts.com:demo", "admin1@ielts.com:demo"].map((code) => (
              <button
                key={code}
                onClick={() => {
                  setEmail(code.split(":")[0]);
                  setPassword(code.split(":")[1]);
                }}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Contact your test center if you don't have an access code
          </p>
        </div>
      </Card>
    </div>
  );
}
