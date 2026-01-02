import { useEffect, useState } from "react";
import { Card } from "../../../shared/ui/card";
import { Input } from "../../../shared/ui/input";
import { Button } from "../../../shared/ui/button";
import { Textarea } from "../../../shared/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../../shared/ui/radio-group";
import { Label } from "../../../shared/ui/label";
import type {
  TestSection,
  HighlightAnnotation,
  ListeningSection,
} from "../../../shared/types";
import { TestTimer } from "../components/TestTimer";
import { TextHighlighter } from "../components/TextHighlighter";
import { Alert, AlertDescription } from "../../../shared/ui/alert";
import { CircleCheck, Volume2, Pause, Play } from "lucide-react";
import { getListeningSection } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { TestTakerInfoHeader } from "../../../shared/ui/TastTakerInfoHeader";
import { SectionInfo } from "../components/SectionIfo";

// interface TestInterfaceProps {
//   section: TestSection;
// }

export default function ListeningModulePage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [highlights, setHighlights] = useState<HighlightAnnotation[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [section, setSection] = useState<ListeningSection | null>(null);
  const { testId } = useParams();
  const navigate = useNavigate();

  const onComplete = () => {
    setShowSubmitConfirm(true);
    console.log("Completed!");
  };

  const onTimeUp = () => {
    console.log("Time up!");
    onComplete();
  };

  if (!testId) {
    navigate("/");
    return;
  }

  useEffect(() => {
    const fetchSection = async () => {
      const section = await getListeningSection(testId);
      console.log(section);
      setSection(section);
    };
    fetchSection();
  }, []);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleHighlight = (highlight: HighlightAnnotation) => {
    setHighlights((prev) => [...prev, highlight]);
  };

  const handleRemoveHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  const handleSubmit = () => {
    onComplete(answers);
  };

  const handleTimeUp = () => {
    onTimeUp();
    handleSubmit();
  };
  if (!section) {
    return <div>Loading...</div>;
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = section.questions.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <TestTakerInfoHeader
        testTakenInfo={{
          id: "12354",
          name: "John Doe",
        }}
      />

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="lg:col-span-2">
          <SectionInfo />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Questions</h2>
            <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              {section.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="pb-4 border-b last:border-b-0"
                >
                  <div className="flex items-start gap-2 mb-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm">
                      {index + 1}
                    </span>
                    <p className="text-sm flex-1">{question.question}</p>
                    {answers[question.id] && (
                      <CircleCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                    )}
                  </div>

                  {/* Multiple choice */}
                  {question.type === "multiple-choice" && question.options && (
                    <RadioGroup
                      value={answers[question.id] || ""}
                      onValueChange={(value: any) =>
                        handleAnswerChange(question.id, value)
                      }
                    >
                      <div className="space-y-2 ml-8">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={option}
                              id={`${question.id}-${optIndex}`}
                            />
                            <Label
                              htmlFor={`${question.id}-${optIndex}`}
                              className="text-sm cursor-pointer"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  )}

                  {/* True/False/Not Given */}
                  {question.type === "true-false-not-given" && (
                    <RadioGroup
                      value={answers[question.id] || ""}
                      onValueChange={(value: any) =>
                        handleAnswerChange(question.id, value)
                      }
                    >
                      <div className="space-y-2 ml-8">
                        {["TRUE", "FALSE", "NOT GIVEN"].map((option) => (
                          <div
                            key={option}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={option}
                              id={`${question.id}-${option}`}
                            />
                            <Label
                              htmlFor={`${question.id}-${option}`}
                              className="text-sm cursor-pointer"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  )}

                  {/* Fill in the blank */}
                  {question.type === "fill-blank" && (
                    <div className="ml-8">
                      <Input
                        value={answers[question.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(question.id, e.target.value)
                        }
                        placeholder="Type your answer..."
                        className="text-sm"
                      />
                    </div>
                  )}

                  {/* Text/Essay */}
                  {question.type === "text" && (
                    <div className="ml-8">
                      <Textarea
                        value={answers[question.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(question.id, e.target.value)
                        }
                        placeholder="Write your response..."
                        rows={6}
                        className="text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Word count:{" "}
                        {
                          (answers[question.id] || "")
                            .split(/\s+/)
                            .filter(Boolean).length
                        }
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Submit confirmation dialog */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Submit Test?</h3>
            <Alert className="mb-4">
              <AlertDescription>
                You have answered {answeredCount} out of {totalQuestions}{" "}
                questions.
                {answeredCount < totalQuestions && (
                  <span className="block mt-2 text-amber-600">
                    Warning: {totalQuestions - answeredCount} question(s) remain
                    unanswered.
                  </span>
                )}
              </AlertDescription>
            </Alert>
            <p className="text-sm text-gray-600 mb-6">
              Once submitted, you cannot change your answers. Are you sure you
              want to continue?
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowSubmitConfirm(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Submit Test</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
