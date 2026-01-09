import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Alert, AlertDescription } from "../../../shared/ui/alert";

interface TestTimerProps {
  duration: number; // in minutes
  onTimeUp: () => void;
  isActive: boolean;
}

export function TestTimer({ duration, onTimeUp, isActive }: TestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }

        // Show warning when 5 minutes left
        if (prev === 300 && !showWarning) {
          setShowWarning(true);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp, showWarning]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isUrgent = timeLeft < 300; // Less than 5 minutes

  return (
    <div className="flex flex-col items-end gap-2">
      {showWarning && timeLeft > 0 && (
        <Alert className="w-80 border-yellow-500 bg-yellow-50">
          <AlertDescription>
            Warning: Less than 5 minutes remaining!
          </AlertDescription>
        </Alert>
      )}
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isUrgent ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
        }`}
      >
        <Clock className="w-5 h-5" />
        <span className="font-mono text-lg">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
