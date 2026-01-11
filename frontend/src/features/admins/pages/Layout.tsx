import { Building2, Download, LogOut } from "lucide-react";
import { Badge } from "../../../shared/ui/badge";
import { Button } from "../../../shared/ui/button";
import { useAuth } from "../../auth/context/AuthContext";
import { useAdminStore } from "../store";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";

export const AdminLayout = () => {
  const { logout } = useAuth();
  const { fetchTenant, tenant } = useAdminStore();

  useEffect(() => {
    fetchTenant();
  }, []);

  if (!tenant) {
    return <h1>Loading...</h1>;
  }
  console.log({ tenant });
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold">{tenant.name}</h1>
                {/* <p className="text-sm text-gray-600">{tenant.location}</p> */}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* <Badge variant="outline" className="text-sm">
                {tenant.agreement}
              </Badge> */}
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
};
