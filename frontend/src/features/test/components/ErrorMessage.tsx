// components/ErrorMessage.tsx
import { AlertCircle } from "lucide-react"; // optional icon (install lucide-react if you want icons)

interface ErrorMessageProps {
  message: string;
  show: boolean;
  type?: "warning" | "error"; // optional: warning (yellow) or error (red)
  className?: string;
}

export default function ErrorMessage({
  message,
  show,
  type = "error",
  className = "",
}: ErrorMessageProps) {
  if (!show) return null;

  const baseStyles =
    "flex items-center gap-3 px-2 py-0.5 rounded-lg text-sm font-medium shadow-md";
  const typeStyles =
    type === "error"
      ? "bg-red-50 text-red-800 border border-red-200"
      : "bg-amber-50 text-amber-800 border border-amber-200";

  return (
    <div className={`${baseStyles} ${typeStyles} ${className}`} role="alert">
      <AlertCircle className="w-5 h-5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
