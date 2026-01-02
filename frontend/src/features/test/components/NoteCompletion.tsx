import type { NoteCompletionQuestionType } from "../../../shared/types";

export default function NoteCompletion({
  block,
}: {
  block: NoteCompletionQuestionType;
}) {
  return (
    <div className="space-y-4 font-serif text-base leading-relaxed">
      {block.blocks.map((b, i) => {
        switch (b.type) {
          case "TITLE":
            return (
              <h2 key={i} className="text-xl font-bold text-center mb-6">
                {b.text}
              </h2>
            );
          case "SECTION_HEADER":
            return (
              <h3 key={i} className="text-lg font-semibold mt-8 mb-4">
                {b.text}
              </h3>
            );
          case "ROW":
            return (
              <div key={i} className="grid grid-cols-3 gap-4 items-center">
                <span className="font-medium">{b.label}</span>
                <span className="col-span-2 border-b border-gray-400 pb-1">
                  {b.value}
                </span>
              </div>
            );
          case "QUESTION_ROW":
          case "QUESTION_BULLET":
            const isBullet = b.type === "QUESTION_BULLET";
            return (
              <div
                key={i}
                className={`flex items-center gap-4 ${isBullet ? "ml-8" : ""}`}
              >
                <span className="font-medium w-8 text-right text-gray-700">
                  {b.number}.
                </span>
                <div className="flex-1 flex items-center gap-3">
                  {b.label && <span>{b.label}</span>}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: (b.template || "").replace(
                        "{{blank}}",
                        `<input type="text" class="inline-input" data-qid="${b.questionId}" />`
                      ),
                    }}
                  />
                </div>
              </div>
            );
          case "TEXT":
            return (
              <p key={i} className="ml-8 font-medium">
                {b.text}
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
