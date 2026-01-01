import { useState } from "react";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Edit2,
  Save,
} from "lucide-react";
import { useAuth } from "../../features/auth/context/AuthContext";

export default function UserProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    bio: "Passionate about helping students achieve their IELTS goals.",
  });

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would save to the backend
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                    <span className="text-4xl text-blue-600">
                      {user?.name.charAt(0)}
                    </span>
                  </div>
                )}
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-xl text-gray-900 mb-1">{user?.name}</h2>
              <p className="text-sm text-gray-600 capitalize mb-4">
                {user?.role.replace("_", " ")}
              </p>

              {user?.tenantName && (
                <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  {user.tenantName}
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">Joined Dec 2023</span>
              </div>
              {user?.role === "teacher" && (
                <div className="flex items-center gap-3 text-sm">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">24 Students</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg text-gray-900">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg text-gray-900 mb-4">Security</h3>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Two-Factor Authentication
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
