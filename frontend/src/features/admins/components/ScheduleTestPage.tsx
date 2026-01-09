import React, { useState } from "react";
import { Card } from "../../../shared/ui/card";
import { Button } from "../../../shared/ui/button";
import { Input } from "../../../shared/ui/input";
import { Label } from "../../../shared/ui/label";
import { Badge } from "../../../shared/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../shared/ui/dialog";
import { Alert, AlertDescription } from "../../../shared/ui/alert";
import {
  Calendar,
  Plus,
  Trash2,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
} from "lucide-react";
import { mockScheduledTests, mockStudents } from "../../../data/mockData";
import type { ScheduledTest, Tenant } from "../types";
import { useAdminStore } from "../store";

export function ScheduleTestPage() {
  const { tenant } = useAdminStore();
  if (!tenant) {
    return <div>Test not found</div>;
  }

  const [scheduledTests, setScheduledTests] = useState<ScheduledTest[]>(
    mockScheduledTests.filter((t) => t.tenantId === tenant.id)
  );
  const [showNewTestDialog, setShowNewTestDialog] = useState(false);

  // New test form state
  const [testDate, setTestDate] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentEmail, setStudentEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");

  const availableStudents = mockStudents.filter(
    (s) => s.tenantId === tenant.id
  );

  const handleAddStudent = () => {
    if (!studentName.trim() || !studentEmail.trim()) {
      setError("Please enter both name and email");
      return;
    }

    if (!studentEmail.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setSelectedStudents([
      ...selectedStudents,
      `${studentName}|${studentEmail}`,
    ]);
    setStudentName("");
    setStudentEmail("");
    setError("");
  };

  const handleRemoveStudent = (index: number) => {
    setSelectedStudents(selectedStudents.filter((_, i) => i !== index));
  };

  const handleScheduleTest = () => {
    if (!testDate) {
      setError("Please select a test date");
      return;
    }

    if (selectedStudents.length === 0) {
      setError("Please add at least one student");
      return;
    }

    if (selectedStudents.length > tenant.testAttempts.remaining) {
      setError(
        `Not enough test attempts. You have ${tenant.testAttempts.remaining} remaining.`
      );
      return;
    }

    const newTest: ScheduledTest = {
      id: `scheduled-${Date.now()}`,
      tenantId: tenant.id,
      testDate,
      students: selectedStudents.map((s, idx) => {
        const [name, email] = s.split("|");
        return {
          id: `student-${Date.now()}-${idx}`,
          name,
          email,
          accessCode: `IELTS-${new Date(testDate).getFullYear()}-${String(
            Math.floor(Math.random() * 1000)
          ).padStart(3, "0")}`,
        };
      }),
      attemptsAllocated: selectedStudents.length,
      status: "scheduled",
    };

    setScheduledTests([...scheduledTests, newTest]);

    // Reset form
    setTestDate("");
    setSelectedStudents([]);
    setError("");
    setShowNewTestDialog(false);
  };

  const handleDeleteScheduledTest = (testId: string) => {
    setScheduledTests(scheduledTests.filter((t) => t.id !== testId));
  };

  const handleStartTest = (testId: string) => {
    console.log("Starting test:", testId);
  };

  const totalScheduledAttempts = scheduledTests.reduce(
    (sum, test) => sum + test.attemptsAllocated,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Attempts</p>
              <p className="text-2xl font-semibold">
                {tenant.testAttempts.total}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Scheduled</p>
              <p className="text-2xl font-semibold">{totalScheduledAttempts}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Available</p>
              <p className="text-2xl font-semibold">
                {tenant.testAttempts.remaining - totalScheduledAttempts}
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Scheduled tests table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Scheduled Mock Tests</h2>
            <p className="text-sm text-gray-600">
              Manage upcoming test sessions and student allocations
            </p>
          </div>
          <Dialog open={showNewTestDialog} onOpenChange={setShowNewTestDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Schedule New Test
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Mock Test</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {/* Test date */}
                <div>
                  <Label htmlFor="testDate">Test Date</Label>
                  <Input
                    id="testDate"
                    type="date"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Add students */}
                <div className="space-y-4">
                  <Label>Add Students</Label>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="Student Name"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddStudent()
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Student Email"
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddStudent()
                        }
                      />
                      <Button type="button" onClick={handleAddStudent}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Selected students list */}
                  {selectedStudents.length > 0 && (
                    <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                      <div className="space-y-2">
                        {selectedStudents.map((student, index) => {
                          const [name, email] = student.split("|");
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                            >
                              <div>
                                <p className="font-medium text-sm">{name}</p>
                                <p className="text-xs text-gray-600">{email}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveStudent(index)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <span className="text-sm">Students to be scheduled:</span>
                    <Badge variant="secondary">{selectedStudents.length}</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">
                      Remaining attempts after scheduling:
                    </span>
                    <Badge
                      variant={
                        tenant.testAttempts.remaining -
                          selectedStudents.length >=
                        0
                          ? "default"
                          : "destructive"
                      }
                    >
                      {tenant.testAttempts.remaining - selectedStudents.length}
                    </Badge>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1"
                    onClick={handleScheduleTest}
                    disabled={selectedStudents.length === 0 || !testDate}
                  >
                    Schedule Test
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowNewTestDialog(false);
                      setError("");
                      setSelectedStudents([]);
                      setTestDate("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {scheduledTests.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No scheduled tests yet</p>
            <p className="text-sm text-gray-500">
              Click "Schedule New Test" to create your first mock test session
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Date</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Attempts Used</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(test.testDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" className="p-0 h-auto">
                          {test.students.length} student
                          {test.students.length !== 1 ? "s" : ""}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Scheduled Students</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 pt-4">
                          {test.students.map((student) => (
                            <div
                              key={student.id}
                              className="p-3 border rounded-lg"
                            >
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-gray-600">
                                {student.email}
                              </p>
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                                {student.accessCode}
                              </code>
                              {student.assignedSeat && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Seat: {student.assignedSeat}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{test.attemptsAllocated}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        test.status === "completed"
                          ? "default"
                          : test.status === "in-progress"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {test.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteScheduledTest(test.id)}
                        disabled={test.status !== "scheduled"}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                      {test.status === "scheduled" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartTest(test.id)}
                        >
                          <Play className="w-4 h-4 text-green-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
