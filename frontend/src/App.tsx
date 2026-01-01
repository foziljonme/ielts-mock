import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { TenantProvider } from "./shared/context/TenantContext";

function App() {
  return (
    <TenantProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </TenantProvider>
  );
}

export default App;
