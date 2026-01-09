import { Card } from "../../../shared/ui/card";
import { Button } from "../../../shared/ui/button";
import { Badge } from "../../../shared/ui/badge";
import { Play, BookOpen, Headphones, PenTool, Mic } from "lucide-react";
import {
  mockReadingSection,
  mockListeningSection,
  mockWritingSection,
} from "../../../data/mockData";
import { useNavigate, useParams } from "react-router-dom";

export default function SectionSelectionPage() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const onSelectSection = (section: string) => {
    navigate(`/exams/${examId}/${section}`);
  };
  const sections = [
    {
      id: "listening",
      name: "Listening",
      icon: Headphones,
      duration: 30,
      questions: 40,
      description: "Listen to recordings and answer questions",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      iconColor: "text-blue-600",
      section: mockListeningSection,
    },
    {
      id: "reading",
      name: "Reading",
      icon: BookOpen,
      duration: 60,
      questions: 40,
      description: "Read passages and answer comprehension questions",
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      iconColor: "text-green-600",
      section: mockReadingSection,
    },
    {
      id: "writing",
      name: "Writing",
      icon: PenTool,
      duration: 60,
      questions: 2,
      description: "Complete two writing tasks",
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      iconColor: "text-purple-600",
      section: mockWritingSection,
    },
    {
      id: "speaking",
      name: "Speaking",
      icon: Mic,
      duration: 15,
      questions: 3,
      description: "Record responses to speaking prompts",
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
      iconColor: "text-orange-600",
      section: null, // Not implemented in demo
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold mb-3">Select Test Section</h1>
          <p className="text-gray-600">
            Choose which section of the IELTS test you would like to take
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <Card
              key={section.id}
              className={`p-6 cursor-pointer transition-all border-2 ${section.color}`}
              onClick={() => onSelectSection(section.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg bg-white ${section.iconColor}`}>
                  <section.icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{section.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {section.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="outline" className="text-xs">
                      {section.duration} minutes
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {section.questions} questions
                    </Badge>
                  </div>

                  {section.section ? (
                    <Button size="sm" className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Start {section.name}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold mb-3">Important Information</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>
                Each section has a time limit. The test will auto-submit when
                time expires.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>
                You can highlight text and add annotations in reading passages.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Make sure to answer all questions before submitting.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Once submitted, you cannot change your answers.</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
