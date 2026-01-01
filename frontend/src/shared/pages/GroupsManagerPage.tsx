import { useState } from "react";
import {
  Search,
  Plus,
  Users,
  Calendar,
  GraduationCap,
  Clock,
} from "lucide-react";
import { mockGroups } from "../../data/mockData";

export default function GroupsManagerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [groups] = useState(mockGroups);

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Advanced":
        return "bg-purple-100 text-purple-800";
      case "Intermediate":
        return "bg-blue-100 text-blue-800";
      case "Beginner":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-2">Groups Management</h1>
          <p className="text-gray-600">Manage and track all groups</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          Create Group
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groups..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg text-gray-900 mb-2">{group.name}</h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${getLevelColor(
                    group.level
                  )}`}
                >
                  {group.level}
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl text-gray-900">{group.students}</div>
                <div className="text-xs text-gray-500">students</div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 flex-shrink-0" />
                <span>{group.teacher}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{group.schedule}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>{group.students} / 20 capacity</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                  View Details
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Edit Group
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
