// App.tsx or layouts/RootLayout.tsx
import { Outlet } from "react-router-dom";
import { AuthProvider } from "../features/auth/context/AuthContext";
import { SocketProvider } from "../shared/context/SocketProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Outlet /> {/* This renders the matched child route */}
      </SocketProvider>
    </AuthProvider>
  );
}
