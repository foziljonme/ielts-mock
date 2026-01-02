// components/MultipleChoiceMultiple.tsx
import type { MultipleChoiceMultipleQuestionType } from "../../../shared/types";
import QuestionGroupWrapper from "./QuestionGroupWrapper";

export default function MultipleChoiceMultiple({
  group,
}: {
  group: MultipleChoiceMultipleQuestionType;
}) {
  return (
    <QuestionGroupWrapper instructions={group.instructions}>
      <div className="max-w-4xl mx-auto">
        {/* Optional shared stem */}
        {group.stem && (
          <p className="text-lg font-medium mb-6 text-center italic">
            {group.stem}
          </p>
        )}

        {/* Options Box (like in real test) */}
        <div className="mb-8 p-6 bg-gray-50 border-2 border-gray-300 rounded-lg mx-0 my-6">
          {group.options.map((opt) => (
            <div key={opt.key} className="flex items-center gap-4 py-1">
              <span className="font-bold text-lg w-8">{opt.key}</span>
              <span>{opt.text}</span>
            </div>
          ))}
        </div>

        {/* Answer spaces */}
        <div className="space-y-6">
          {group.questions.map((q) => (
            <div key={q.questionId} className="flex items-center gap-6">
              <span className="font-medium w-12 text-right text-gray-700">
                {q.number}
              </span>
              {/* {q.label && <span className="font-medium w-40">{q.label}</span>} */}
              <input
                type="text"
                data-qid={q.questionId}
                className="w-16 border-b-2 border-gray-600 text-center focus:border-blue-600 outline-none text-lg inline-input"
                maxLength={1}
              />
            </div>
          ))}
        </div>

        {/* Alternative: Checkbox version (optional for practice mode) */}
        {/* You can add a toggle to switch to checkboxes if desired */}
      </div>
    </QuestionGroupWrapper>
  );
}
