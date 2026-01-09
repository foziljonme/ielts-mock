// components/MultipleChoiceSingle.tsx
import type { MultipleChoiceSingleQuestionType } from "../../../shared/types";
import QuestionGroupWrapper from "./QuestionGroupWrapper";

export default function MultipleChoiceSingle({
  group,
  errors,
}: {
  group: MultipleChoiceSingleQuestionType;
  errors: Record<string, string>;
}) {
  return (
    <QuestionGroupWrapper instructions={group.instructions}>
      <div className="space-y-10 max-w-3xl mx-auto">
        {group.items.map((item) => (
          <div key={item.questionId} className="pl-8">
            <p className="font-medium mb-4 leading-relaxed">
              <span className="inline-block w-10 text-right mr-4 font-bold">
                {item.number}.
              </span>
              {item.stem}
            </p>
            <div className="space-y-3 ml-12">
              {item.options.map((opt) => (
                <label
                  key={opt.key}
                  className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition"
                >
                  <input
                    type="radio"
                    data-qid={item.questionId}
                    name={item.questionId}
                    value={opt.key}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-gray-800">
                    {opt.key}.
                  </span>
                  <span className="text-gray-700">{opt.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </QuestionGroupWrapper>
  );
}
