import { useState } from "react";
import { Search, Download, Filter } from "lucide-react";
import { mockGrades } from "../../data/mockData";
import { useAuth } from "../../features/auth/context/AuthContext";

export default function GradesManagerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [grades] = useState(mockGrades);
  const { user } = useAuth();

  const isStudent = user?.role === "student";
  const filteredGrades = isStudent
    ? grades.filter((g) => g.studentId === user?.id)
    : grades.filter((grade) =>
        grade.studentName.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-green-600 bg-green-50";
    if (score >= 6) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-2">
            {isStudent ? "My Grades" : "Grades Management"}
          </h1>
          <p className="text-gray-600">
            {isStudent
              ? "View your IELTS test results"
              : "Track and manage student grades"}
          </p>
        </div>
        {!isStudent && (
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-5 h-5" />
            Export Grades
          </button>
        )}
      </div>

      {!isStudent && (
        <div className="flex gap-4">
          <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {!isStudent && (
                  <th className="text-left px-6 py-4 text-sm text-gray-700">
                    Student
                  </th>
                )}
                <th className="text-left px-6 py-4 text-sm text-gray-700">
                  Date
                </th>
                {!isStudent && (
                  <th className="text-left px-6 py-4 text-sm text-gray-700">
                    Group
                  </th>
                )}
                <th className="text-center px-6 py-4 text-sm text-gray-700">
                  Listening
                </th>
                <th className="text-center px-6 py-4 text-sm text-gray-700">
                  Reading
                </th>
                <th className="text-center px-6 py-4 text-sm text-gray-700">
                  Writing
                </th>
                <th className="text-center px-6 py-4 text-sm text-gray-700">
                  Speaking
                </th>
                <th className="text-center px-6 py-4 text-sm text-gray-700">
                  Overall
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredGrades.map((grade, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  {!isStudent && (
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {grade.studentName}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {new Date(grade.date).toLocaleDateString()}
                    </span>
                  </td>
                  {!isStudent && (
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                        {grade.group}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getScoreColor(
                        grade.listening
                      )}`}
                    >
                      {grade.listening}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getScoreColor(
                        grade.reading
                      )}`}
                    >
                      {grade.reading}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getScoreColor(
                        grade.writing
                      )}`}
                    >
                      {grade.writing}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getScoreColor(
                        grade.speaking
                      )}`}
                    >
                      {grade.speaking}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full ${getScoreColor(
                        grade.overall
                      )}`}
                    >
                      {grade.overall}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isStudent && filteredGrades.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-600 mb-1">Best Listening</p>
            <p className="text-2xl text-blue-900">
              {Math.max(...filteredGrades.map((g) => g.listening))}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <p className="text-sm text-green-600 mb-1">Best Reading</p>
            <p className="text-2xl text-green-900">
              {Math.max(...filteredGrades.map((g) => g.reading))}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <p className="text-sm text-purple-600 mb-1">Best Writing</p>
            <p className="text-2xl text-purple-900">
              {Math.max(...filteredGrades.map((g) => g.writing))}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
            <p className="text-sm text-orange-600 mb-1">Best Speaking</p>
            <p className="text-2xl text-orange-900">
              {Math.max(...filteredGrades.map((g) => g.speaking))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
