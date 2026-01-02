import type { MultipleChoiceSingleQuestionType } from "../../../shared/types";

export default function MultipleChoiceSingle({
  group,
}: {
  group: MultipleChoiceSingleQuestionType;
}) {
  return (
    <div className="space-y-8">
      {group.items.map((item) => (
        <div key={item.questionId} className="pl-6">
          <p className="font-medium mb-3">
            <span className="inline-block w-8 text-right mr-4">
              {item.number}.
            </span>
            {item.stem}
          </p>
          <div className="space-y-2 ml-12">
            {item.options.map((opt) => (
              <label
                key={opt.key}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="radio"
                  name={item.questionId}
                  value={opt.key}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="font-medium text-gray-800">{opt.key}.</span>
                <span>{opt.text}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
