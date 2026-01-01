import { useState } from "react";
import { Search, Plus, Mail, Users, MoreVertical } from "lucide-react";
import { mockTeachers } from "../../../data/mockData";

export default function TeachersManagerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers] = useState(mockTeachers);

  const filteredTeachers = teachers.filter(
    (teacher) => console.log("Do filtering here!")
    // teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    // teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-2">Teachers Management</h1>
          <p className="text-gray-600">Manage and track all teachers</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Teacher
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teachers by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <img
                src={teacher.avatar}
                alt={teacher.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <h3 className="text-lg text-gray-900 mb-1">{teacher.name}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {teacher.specialization}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Mail className="w-4 h-4" />
              {teacher.email}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Users className="w-4 h-4" />
              {teacher.students} students
            </div>

            <button className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
