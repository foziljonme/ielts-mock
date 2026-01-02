// App.tsx or ListeningTest.tsx
import { useEffect, useState } from "react";
import QuestionSection from "../components/QuestionSection";
import type { ListeningTest } from "../../../shared/types";
import { getListeningSection } from "../api";

export default function ListeningTestPage() {
  const [testData, setTestData] = useState<ListeningTest | null>(null);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);

  useEffect(() => {
    const fetchSection = async () => {
      const response = await getListeningSection("listening-full");
      setTestData(response);
    };
    fetchSection();
  }, []);

  if (!testData) {
    return <div>Loading...</div>;
  }

  const currentPart = testData.parts[currentPartIndex];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            IELTS Listening Practice Test
          </h1>
          <div className="text-sm text-gray-600">
            Part {currentPart.part} of 4
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto w-full px-4 py-6 gap-8">
        {/* Left: Questions (Booklet Style) */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-8 overflow-y-auto">
          {/* <PartNavigation
            parts={testData.parts}
            currentPartIndex={currentPartIndex}
            onPartChange={setCurrentPartIndex}
          /> */}

          <div className="mt-8">
            {currentPart.questions.map((questionGroup, idx) => (
              <QuestionSection key={idx} questionGroup={questionGroup} />
            ))}
          </div>
        </div>

        {/* Right: Audio Player (Fixed on larger screens) */}
        {/* <div className="lg:w-96">
          <div className="sticky top-6">
            <AudioPlayer
              audioUrl={currentPart.audio!.url}
              playOnce={currentPart.audio!.playOnce ?? true}
            />
          </div>
        </div> */}
      </div>

      {/* Footer Controls */}
      <footer className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-between">
          <button
            onClick={() =>
              setCurrentPartIndex(Math.max(0, currentPartIndex - 1))
            }
            disabled={currentPartIndex === 0}
            className="px-6 py-3 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            Previous Part
          </button>
          <button
            onClick={() =>
              setCurrentPartIndex(
                Math.min(testData.parts.length - 1, currentPartIndex + 1)
              )
            }
            disabled={currentPartIndex === testData.parts.length - 1}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Next Part
          </button>
        </div>
      </footer>
    </div>
  );
}
