import React, { useEffect, useState } from "react";
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
import { useAdminStore } from "../store";
import { ExamSessionStatus } from "../types";

export function ScheduleTestTab() {
  // const [scheduledTests, setScheduledTests] = useState<ScheduledTest[]>(
  //   mockScheduledTests.filter((t) => t.tenantId === tenant.id)
  // );
  const { tenantStats, fetchTenantStats, examSessions, fetchExamSessions } =
    useAdminStore();
  const [showNewTestDialog, setShowNewTestDialog] = useState(false);

  // New test form state
  const [testDate, setTestDate] = useState("");
  const [newSessionCandidates, setNewSessionCandidates] = useState<
    {
      name: string;
      contact: string;
    }[]
  >([]);
  const [candidateContact, setCandidateContact] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [testName, setTestName] = useState("");
  const [error, setError] = useState("");

  const handleAddCandidate = () => {
    if (!candidateName.trim() || !candidateContact.trim()) {
      setError("Please enter both name and email");
      return;
    }

    if (!candidateContact.trim()) {
      setError("Please enter a valid contact information");
      return;
    }

    setNewSessionCandidates([
      ...newSessionCandidates,
      {
        name: candidateName,
        contact: candidateContact,
      },
    ]);
    setCandidateName("");
    setCandidateContact("");
    setError("");
  };

  const handleRemoveCandidate = (index: number) => {
    setNewSessionCandidates(newSessionCandidates.filter((_, i) => i !== index));
  };

  const handleScheduleTest = () => {
    if (!testName) {
      setError("Please enter a test name");
      return;
    }

    if (!testDate) {
      setError("Please select a test date");
      return;
    }

    if (newSessionCandidates.length > tenantStats?.seats.available!) {
      setError(
        `Not enough seats available. You have ${tenantStats?.seats.available} remaining.`
      );
      return;
    }

    // const newTest: ScheduledTest = {
    //   id: `scheduled-${Date.now()}`,
    //   tenantId: tenant.id,
    //   testDate,
    //   students: selectedStudents.map((s, idx) => {
    //     const [name, email] = s.split("|");
    //     return {
    //       id: `student-${Date.now()}-${idx}`,
    //       name,
    //       email,
    //       accessCode: `IELTS-${new Date(testDate).getFullYear()}-${String(
    //         Math.floor(Math.random() * 1000)
    //       ).padStart(3, "0")}`,
    //     };
    //   }),
    //   attemptsAllocated: selectedStudents.length,
    //   status: "scheduled",
    // };

    // setScheduledTests([...scheduledTests, newTest]);

    // Reset form
    setTestDate("");
    setNewSessionCandidates([]);
    setError("");
    setShowNewTestDialog(false);
  };

  const shouldDisableScheduleButton = () => {
    return !testName || !testDate;
  };

  const handleDeleteScheduledTest = (testId: string) => {
    // setScheduledTests(scheduledTests.filter((t) => t.id !== testId));
  };

  useEffect(() => {
    Promise.all([fetchTenantStats(), fetchExamSessions()]).then(() => {});
  }, []);

  if (!tenantStats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Seats</p>
              <p className="text-2xl font-semibold">
                {tenantStats?.seats.total}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Scheduled</p>
              <p className="text-2xl font-semibold">
                {tenantStats?.sessions.scheduled}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Available</p>
              <p className="text-2xl font-semibold">
                {tenantStats?.seats.available}
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
                {/* Test Information */}
                <div>
                  <Label htmlFor="testName">Test Name</Label>
                  <Input
                    id="testName"
                    type="text"
                    placeholder="e.g. IELTS Mock Test Sturday 10:00 AM"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                  />
                </div>

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

                {/* Add candidates */}
                <div className="space-y-4">
                  <Label>Add Candidates</Label>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="Candidate Name"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddCandidate()
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Candidate Contact"
                        type="text"
                        value={candidateContact}
                        onChange={(e) => setCandidateContact(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddCandidate()
                        }
                      />
                      <Button type="button" onClick={handleAddCandidate}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Selected students list */}
                  {newSessionCandidates.length > 0 && (
                    <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                      <div className="space-y-2">
                        {newSessionCandidates.map((candidate, index) => {
                          const { name, contact } = candidate;
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                            >
                              <div>
                                <p className="font-medium text-sm">{name}</p>
                                <p className="text-xs text-gray-600">
                                  {contact}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveCandidate(index)}
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
                    <span className="text-sm">Candidates to be scheduled:</span>
                    <Badge variant="secondary">
                      {newSessionCandidates.length}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">
                      Remaining attempts after scheduling:
                    </span>
                    <Badge
                      variant={
                        tenantStats?.seats.available! -
                          newSessionCandidates.length >=
                        0
                          ? "default"
                          : "destructive"
                      }
                    >
                      {tenantStats?.seats.available! -
                        newSessionCandidates.length}
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
                    disabled={shouldDisableScheduleButton()}
                  >
                    Schedule Test
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowNewTestDialog(false);
                      setError("");
                      setNewSessionCandidates([]);
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

        {examSessions.length === 0 ? (
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
                <TableHead>Candidates</TableHead>
                {/* <TableHead>Seats Used</TableHead> */}
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examSessions.map((examSession) => (
                <TableRow key={examSession.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(examSession.examDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="link"
                          className="p-0 h-auto cursor-pointer"
                        >
                          {examSession.seats.length} candidate
                          {examSession.seats.length !== 1 ? "s" : ""}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Scheduled Candidates</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 pt-4">
                          {examSession.seats.map((seat) => (
                            <div
                              key={seat.id}
                              className="p-3 border rounded-lg"
                            >
                              <p className="font-medium">
                                {seat.candidateName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {seat.candidateContact}
                              </p>
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                                {seat.accessCode}
                              </code>
                              <p className="text-sm text-gray-600 mt-1">
                                Seat: {seat.seatNumber}
                              </p>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  {/* <TableCell>
                    <Badge variant="outline">{examSession.seats.length}</Badge>
                  </TableCell> */}
                  <TableCell>
                    <Badge
                      variant={
                        examSession.status === ExamSessionStatus.COMPLETED
                          ? "default"
                          : examSession.status === ExamSessionStatus.IN_PROGRESS
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {examSession.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDeleteScheduledTest(examSession.id)
                        }
                        disabled={
                          examSession.status !== ExamSessionStatus.SCHEDULED
                        }
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                      {/* {onStartTest &&
                        examSession.status === ExamSessionStatus.SCHEDULED && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onStartTest(test)}
                          >
                            <Play className="w-4 h-4 text-green-500" />
                          </Button>
                        )} */}
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
