import React, { useState } from "react";
import { Card } from "../../../shared/ui/card";
import { Button } from "../../../shared/ui/button";
import { Input } from "../../../shared/ui/input";
import { LogIn, GraduationCap } from "lucide-react";
import { Label } from "../../../shared/ui/label";
import { Alert, AlertDescription } from "../../../shared/ui/alert";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SessionLoginPage() {
  const { sessionLogin, redirectUrl } = useAuth();
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setError("Please enter your access code");
      return;
    }

    // Validate access code format
    if (!accessCode.startsWith("IELTS-")) {
      setError("Invalid access code format");
      return;
    }

    sessionLogin(accessCode);
    navigate(redirectUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">IELTS Test Simulation</h1>
          <p className="text-gray-600">Enter your access code to begin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="accessCode">Access Code</Label>
            <Input
              id="accessCode"
              type="text"
              placeholder="IELTS-2026-XXX"
              value={accessCode}
              onChange={(e) => {
                setAccessCode(e.target.value);
                setError("");
              }}
              className="text-center text-lg tracking-wider"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" size="lg">
            <LogIn className="w-4 h-4 mr-2" />
            Start Test
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t">
          <p className="text-xs text-gray-500 text-center">
            Demo Access Codes:
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {["IELTS-2026-001", "IELTS-2026-002", "IELTS-2026-003"].map(
              (code) => (
                <button
                  key={code}
                  onClick={() => setAccessCode(code)}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  {code}
                </button>
              )
            )}
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
