import type { NoteCompletionQuestionType } from "../../../shared/types";
import { constructTemplate, parseHtml } from "../utils";
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
                  data-type="title"
                >
                  {block.text}
                </h2>
              );

            case "SECTION_HEADER":
              return (
                <h3
                  key={idx}
                  className="text-lg font-semibold text-gray-800 mt-10 mb-4 underline"
                  data-type="section-header"
                >
                  {block.text}
                </h3>
              );

            case "ROW":
              return (
                <div
                  key={idx}
                  className="grid grid-cols-2 gap-4 items-center"
                  data-type="row"
                >
                  <span className="font-medium">{block.label}</span>
                  <span className="border-b-2 border-gray-600 pb-1">
                    {block.value}
                  </span>
                </div>
              );

            case "ROW_SUB":
              return (
                <div
                  key={idx}
                  className="flex items-center gap-16"
                  data-type="row-sub"
                >
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
                  data-type="question-row"
                >
                  {block.label !== undefined && <span>{block.label}</span>}
                  <div className="flex items-center gap-3">
                    {parseHtml(constructTemplate(block))}
                  </div>
                </div>
              );

            case "QUESTION_ROW_SUB":
              return (
                <div
                  key={idx}
                  className="flex items-center gap-16"
                  data-type="question-row-sub"
                >
                  <div></div>
                  <div>{parseHtml(constructTemplate(block))}</div>
                </div>
              );

            case "QUESTION_BULLET":
              return (
                <div
                  key={idx}
                  className="flex items-center gap-6 ml-10"
                  data-type="question-bullet"
                >
                  <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                  <div className="">{parseHtml(constructTemplate(block))}</div>
                </div>
              );

            case "ROW_BULLET":
              return (
                <div
                  key={idx}
                  className="flex items-center gap-6 ml-10"
                  data-type="row-bullet"
                >
                  <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                  <div className="flex-1 flex items-center gap-3">
                    <span>{block.text}</span>
                  </div>
                </div>
              );

            case "TEXT":
              return (
                <p
                  key={idx}
                  className="font-medium text-gray-700 italic"
                  data-type="text"
                >
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
