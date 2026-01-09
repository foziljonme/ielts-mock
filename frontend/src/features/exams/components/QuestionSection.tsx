import type { ListeningQuestionType } from "../../../shared/types";
import MultipleChoiceSingle from "./MultipleChoiceSingle";
import NoteCompletion from "./NoteCompletion";

export default function QuestionSection({
  questionGroup,
}: {
  questionGroup: ListeningQuestionType;
}) {
  return (
    <div className="mb-12 print:mb-8">
      {/* Instructions */}
      <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500">
        {questionGroup.instructions.map((inst, i) => (
          <p key={i} className="text-sm font-medium text-amber-900">
            {inst}
          </p>
        ))}
      </div>

      {/* Render based on type */}
      {questionGroup.type === "NOTE_COMPLETION" && (
        <NoteCompletion block={questionGroup} />
      )}
      {questionGroup.type === "MULTIPLE_CHOICE_SINGLE" && (
        <MultipleChoiceSingle group={questionGroup} />
      )}
      {/* {questionGroup.type === "MULTIPLE_CHOICE_MULTIPLE" && (
        <MultipleChoiceMultiple group={questionGroup} />
      )} */}
    </div>
  );
}
