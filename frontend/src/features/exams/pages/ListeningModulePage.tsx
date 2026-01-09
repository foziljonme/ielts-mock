// pages/ListeningTest.tsx or components/ListeningTestPage.tsx
import { useEffect, useRef, useState } from "react";
import type { ListeningTest } from "../../../shared/types";
import { getListeningSection } from "../api";
import ListeningPart from "../components/ListeningPart";
import useForm from "../hooks/useForm";

export default function ListeningTestPage() {
  const [testData, setTestData] = useState<ListeningTest | null>(null);
  const [currentPartIndex, setCurrentPartIndex] = useState(1);
  const { errors, inputHandler, restoreAnswers } = useForm();
  const listeningRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSection = async () => {
      const response = await getListeningSection("cmjzrraoz0002rso1c9hq2i7s");
      console.log({ response });
      setTestData(response);
    };
    fetchSection();
  }, []);

  useEffect(() => {
    const container = listeningRef.current;
    if (!container) return;

    container.addEventListener("input", inputHandler);
    restoreAnswers();

    return () => {
      container.removeEventListener("input", inputHandler);
    };
  }, [testData, currentPartIndex]);

  if (!testData) {
    return <div>Loading...</div>;
  }

  const currentPart = testData.parts[currentPartIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-300 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              IELTS Listening Practice Test
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Computer-Delivered Format Simulation
            </p>
          </div>
          <div className="text-center">
            <span className="text-xl font-semibold text-blue-700">
              PART {currentPart.part} / 4
            </span>
          </div>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-4 py-8 gap-10">
        {/* Left: Questions (Scrollable Booklet) */}
        <div
          className="flex-1 bg-white rounded-xl shadow-lg p-8 overflow-y-auto max-h-[80vh] lg:max-h-none"
          ref={listeningRef}
        >
          <ListeningPart part={currentPart} errors={errors} />
        </div>

        {/* Right: Audio Player (Fixed/Sticky) */}
        {/* <div className="lg:w-96 flex-shrink-0">
          <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Audio Player - Part {currentPart.part}
            </h3>
            <AudioPlayer
              audioUrl={currentPart.audio?.url || "/audio/placeholder.mp3"}
              playOnce={currentPart.audio?.playOnce ?? true}
            />
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>⏱ Audio plays once only</p>
              <p className="mt-2 font-medium">
                You have 30 minutes for the full test
              </p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Bottom Navigation */}
      <footer className="bg-white border-t border-gray-300 px-6 py-5 sticky bottom-0 shadow-up">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() =>
              setCurrentPartIndex(Math.max(0, currentPartIndex - 1))
            }
            disabled={currentPartIndex === 0}
            className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
          >
            ← Previous Part
          </button>

          <div className="flex gap-3">
            {testData.parts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPartIndex(idx)}
                className={`w-12 h-12 rounded-full font-bold transition ${
                  idx === currentPartIndex
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {currentPartIndex < testData.parts.length - 1 ? (
            <button
              onClick={() => setCurrentPartIndex(currentPartIndex + 1)}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Next Part →
            </button>
          ) : (
            <button className="px-8 py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
              Finish Test
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
