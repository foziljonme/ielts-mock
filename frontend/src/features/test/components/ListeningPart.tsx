// components/ListeningPart.tsx
import NoteCompletion from "./NoteCompletion";
import MultipleChoiceSingle from "./MultipleChoiceSingle";
import MultipleChoiceMultiple from "./MultipleChoiceMultiple";
import type { ListeningSection } from "../../../shared/types";

export default function ListeningPart({ part }: { part: ListeningSection }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
        PART {part.part}
      </h2>

      {part.questions.map((group, idx) => (
        <div key={idx}>
          {group.type === "NOTE_COMPLETION" && <NoteCompletion group={group} />}
          {group.type === "MULTIPLE_CHOICE_SINGLE" && (
            <MultipleChoiceSingle group={group} />
          )}
          {group.type === "MULTIPLE_CHOICE_MULTIPLE" && (
            <MultipleChoiceMultiple group={group} />
          )}
        </div>
      ))}
    </div>
  );
}
