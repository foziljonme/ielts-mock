// components/QuestionGroupWrapper.tsx
import type { ReactNode } from "react";

interface Props {
  instructions: string[];
  children: ReactNode;
}

export default function QuestionGroupWrapper({
  instructions,
  children,
}: Props) {
  return (
    <div className="mb-12">
      <div className="mb-6 p-5 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
        {instructions.map((inst, i) => (
          <p
            key={i}
            className="text-sm font-medium text-amber-900 leading-relaxed"
          >
            {inst}
          </p>
        ))}
      </div>
      {children}
    </div>
  );
}
