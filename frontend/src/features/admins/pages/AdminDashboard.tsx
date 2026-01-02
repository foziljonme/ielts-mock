import { useState } from "react";
import { Card } from "../../../shared/ui/card";
import { Button } from "../../../shared/ui/button";
import { Input } from "../../../shared/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/ui/table";
import { Badge } from "../../../shared/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../shared/ui/tabs";
import {
  Users,
  ClipboardList,
  DollarSign,
  TrendingUp,
  Search,
  Download,
  Plus,
  Building2,
} from "lucide-react";
import {
  mockStudents,
  mockTestResults,
  mockTenants,
} from "../../../data/mockData";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const tenant = mockTenants[0]; // Current tenant
  const students = mockStudents.filter((s) => s.tenantId === tenant.id);
  const results = mockTestResults.filter((r) => r.tenantId === tenant.id);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalStudents: students.length,
    activeTests: students.filter((s) => s.testStatus === "in-progress").length,
    completedTests: results.length,
    revenue: results.length * tenant.pricePerTest,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold">{tenant.name}</h1>
                <p className="text-sm text-gray-600">{tenant.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {tenant.agreement}
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-2xl font-semibold">{stats.totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Tests</p>
                <p className="text-2xl font-semibold">{stats.activeTests}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-orange-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-semibold">{stats.completedTests}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revenue</p>
                <p className="text-2xl font-semibold">£{stats.revenue}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
            <TabsTrigger value="quotes">Custom Quotes</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Student Management</h2>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Access Code</TableHead>
                    <TableHead>Test Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Seat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell className="text-gray-600">
                        {student.email}
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {student.accessCode || "-"}
                        </code>
                      </TableCell>
                      <TableCell>{student.testDate || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.testStatus === "completed"
                              ? "default"
                              : student.testStatus === "in-progress"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {student.testStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{student.assignedSeat || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Test Results</h2>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Listening</TableHead>
                    <TableHead>Reading</TableHead>
                    <TableHead>Writing</TableHead>
                    <TableHead>Speaking</TableHead>
                    <TableHead>Overall</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => {
                    const student = students.find(
                      (s) => s.id === result.studentId
                    );
                    return (
                      <TableRow key={result.id}>
                        <TableCell>{student?.name}</TableCell>
                        <TableCell>{result.testDate}</TableCell>
                        <TableCell>{result.sections.listening}</TableCell>
                        <TableCell>{result.sections.reading}</TableCell>
                        <TableCell>{result.sections.writing}</TableCell>
                        <TableCell>{result.sections.speaking}</TableCell>
                        <TableCell>
                          <Badge variant="default">{result.overallScore}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Quotes Tab */}
          <TabsContent value="quotes" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Custom Quote Generator
              </h2>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Number of Students
                    </label>
                    <Input type="number" placeholder="50" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Tests per Student
                    </label>
                    <Input type="number" placeholder="2" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Duration (months)
                    </label>
                    <Input type="number" placeholder="6" />
                  </div>
                </div>

                <Card className="p-6 bg-blue-50 border-blue-200">
                  <h3 className="font-semibold mb-4">Quote Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Base Price per Test:</span>
                      <span className="font-semibold">
                        £{tenant.pricePerTest}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Volume Discount:</span>
                      <span className="font-semibold text-green-600">-10%</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-sm">Total Tests:</span>
                      <span className="font-semibold">100</span>
                    </div>
                    <div className="flex justify-between text-lg pt-2 border-t">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="font-semibold text-blue-600">
                        £4,050
                      </span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Generate Quote PDF</Button>
                </Card>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Package Details</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• {tenant.agreement}</li>
                  <li>• {tenant.totalSeats} workstations available</li>
                  <li>• Full technical support included</li>
                  <li>• Detailed analytics and reporting</li>
                  <li>• Custom branding options</li>
                </ul>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
