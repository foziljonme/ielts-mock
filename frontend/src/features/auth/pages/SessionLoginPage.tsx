import React, { useState } from "react";
import { Card } from "../../../shared/ui/card";
import { Button } from "../../../shared/ui/button";
import { Input } from "../../../shared/ui/input";
import { LogIn, GraduationCap } from "lucide-react";
import { Label } from "../../../shared/ui/label";
import { Alert, AlertDescription } from "../../../shared/ui/alert";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function SessionLoginPage() {
  const { loginSession } = useAuth();
  const [studentId, setStudentId] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setError("Please enter your access code");
      return;
    }

    if (!studentId.trim()) {
      setError("Please enter your student ID");
      return;
    }

    loginSession(accessCode, studentId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">IELTS Test Simulation</h1>
          <p className="text-gray-600">
            Enter your student ID and access code to begin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              type="text"
              placeholder="123456789"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                setError("");
              }}
              className="text-center text-lg tracking-wider"
            />
          </div>

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
          <Link
            to="/auth/admin/login"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md px-6 has-[>svg]:px-4 w-full"
          >
            Login as Admin
          </Link>
        </form>

        <div className="mt-8 pt-6 border-t">
          <p className="text-xs text-gray-500 text-center">
            Demo Access Codes:
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {[
              "774749:Au7W1PwVaW",
              "458857:IDRf5ub5ND",
              "267178:1j35RxXdO4",
            ].map((code) => (
              <button
                key={code}
                onClick={() => {
                  const [studentId, accessCode] = code.split(":");
                  setStudentId(studentId);
                  setAccessCode(accessCode);
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
