import React, { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { TestSection, HighlightAnnotation } from '../types';
import { TestTimer } from './TestTimer';
import { TextHighlighter } from './TextHighlighter';
import { Alert, AlertDescription } from './ui/alert';
import { CircleCheck, Volume2, Pause, Play } from 'lucide-react';

interface TestInterfaceProps {
  section: TestSection;
  onComplete: (answers: Record<string, string>) => void;
  onTimeUp: () => void;
}

export function TestInterface({ section, onComplete, onTimeUp }: TestInterfaceProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [highlights, setHighlights] = useState<HighlightAnnotation[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

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

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = section.questions.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{section.name}</h1>
            <p className="text-sm text-gray-600">
              Questions answered: {answeredCount} / {totalQuestions}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <TestTimer 
              duration={section.duration} 
              onTimeUp={handleTimeUp}
              isActive={true}
            />
            <Button onClick={() => setShowSubmitConfirm(true)} size="lg">
              Submit Test
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side - Passage/Content */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              {section.audioUrl && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">Listening Test - Audio Simulation</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="ml-auto"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Note: In a real test, audio would play automatically
                  </p>
                </div>
              )}

              {section.passage && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Reading Passage</h2>
                  <TextHighlighter
                    text={section.passage}
                    highlights={highlights}
                    onHighlight={handleHighlight}
                    onRemoveHighlight={handleRemoveHighlight}
                  />
                </div>
              )}
            </Card>
          </div>

          {/* Right side - Questions */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Questions</h2>
              <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {section.questions.map((question, index) => (
                  <div key={question.id} className="pb-4 border-b last:border-b-0">
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
                    {question.type === 'multiple-choice' && question.options && (
                      <RadioGroup
                        value={answers[question.id] || ''}
                        onValueChange={(value) => handleAnswerChange(question.id, value)}
                      >
                        <div className="space-y-2 ml-8">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`${question.id}-${optIndex}`} />
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
                    {question.type === 'true-false-not-given' && (
                      <RadioGroup
                        value={answers[question.id] || ''}
                        onValueChange={(value) => handleAnswerChange(question.id, value)}
                      >
                        <div className="space-y-2 ml-8">
                          {['TRUE', 'FALSE', 'NOT GIVEN'].map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`${question.id}-${option}`} />
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
                    {question.type === 'fill-blank' && (
                      <div className="ml-8">
                        <Input
                          value={answers[question.id] || ''}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          placeholder="Type your answer..."
                          className="text-sm"
                        />
                      </div>
                    )}

                    {/* Text/Essay */}
                    {question.type === 'text' && (
                      <div className="ml-8">
                        <Textarea
                          value={answers[question.id] || ''}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          placeholder="Write your response..."
                          rows={6}
                          className="text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Word count: {(answers[question.id] || '').split(/\s+/).filter(Boolean).length}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Submit confirmation dialog */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Submit Test?</h3>
            <Alert className="mb-4">
              <AlertDescription>
                You have answered {answeredCount} out of {totalQuestions} questions.
                {answeredCount < totalQuestions && (
                  <span className="block mt-2 text-amber-600">
                    Warning: {totalQuestions - answeredCount} question(s) remain unanswered.
                  </span>
                )}
              </AlertDescription>
            </Alert>
            <p className="text-sm text-gray-600 mb-6">
              Once submitted, you cannot change your answers. Are you sure you want to continue?
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowSubmitConfirm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Submit Test
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}