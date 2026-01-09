import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { TenantProvider } from "./shared/context/TenantContext";
import "./styles/index.css";

function App() {
  return (
    <TenantProvider>
      <RouterProvider router={router} />
    </TenantProvider>
  );
}

export default App;
