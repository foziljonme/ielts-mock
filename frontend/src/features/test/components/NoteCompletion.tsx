import type { NoteCompletionQuestionType } from "../../../shared/types";
import { constructTemplate } from "../utils";
import QuestionGroupWrapper from "./QuestionGroupWrapper";

export default function NoteCompletion({
  group,
}: {
  group: NoteCompletionQuestionType;
}) {
  return (
    <QuestionGroupWrapper instructions={group.instructions}>
      <div className="text-base leading-loose space-y-5 max-w-3xl mx-auto">
        {group.blocks.map((block, idx) => {
          switch (block.type) {
            case "TITLE":
              return (
                <h2
                  key={idx}
                  className="text-2xl font-bold text-center mt-8 mb-6"
                >
                  {block.text}
                </h2>
              );

            case "SECTION_HEADER":
              return (
                <h3
                  key={idx}
                  className="text-lg font-semibold text-gray-800 mt-10 mb-4 underline"
                >
                  {block.text}
                </h3>
              );

            case "ROW":
              return (
                <div key={idx} className="grid grid-cols-2 gap-4 items-center">
                  <span className="font-medium">{block.label}</span>
                  <span className="border-b-2 border-gray-600 pb-1">
                    {block.value}
                  </span>
                </div>
              );

            case "ROW_SUB":
              return (
                <div key={idx} className="flex items-center gap-16">
                  <div></div>
                  <div className="flex-1 flex items-center gap-3">
                    <span>{block.text}</span>
                  </div>
                </div>
              );

            case "QUESTION_ROW":
              return (
                <div
                  key={idx}
                  className={`grid ${
                    block.label !== undefined ? "grid-cols-2" : "grid-cols-1"
                  } gap-4 items-center`}
                >
                  {block.label !== undefined && <span>{block.label}</span>}
                  <div className="flex items-center gap-3">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: constructTemplate(block),
                      }}
                    />
                  </div>
                </div>
              );

            case "QUESTION_ROW_SUB":
              return (
                <div key={idx} className="flex items-center gap-16">
                  <div></div>
                  <div className="flex-1 flex items-center gap-3">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: constructTemplate(block),
                      }}
                    />
                  </div>
                </div>
              );

            case "QUESTION_BULLET":
              return (
                <div key={idx} className="flex items-center gap-6 ml-10">
                  <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                  <div className="flex-1 flex items-center gap-3">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: constructTemplate(block),
                      }}
                    />
                  </div>
                </div>
              );

            case "ROW_BULLET":
              console.log({ block });

              return (
                <div key={idx} className="flex items-center gap-6 ml-10">
                  <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                  <div className="flex-1 flex items-center gap-3">
                    <span>{block.text}</span>
                  </div>
                </div>
              );

            case "TEXT":
              return (
                <p key={idx} className="font-medium text-gray-700 italic">
                  {block.text}
                </p>
              );

            default:
              return null;
          }
        })}
      </div>
    </QuestionGroupWrapper>
  );
}
