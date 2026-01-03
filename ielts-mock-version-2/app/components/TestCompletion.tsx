import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CircleCheck, Clock, Award } from 'lucide-react';

interface TestCompletionProps {
  studentName: string;
  answers: Record<string, string>;
  onViewResults?: () => void;
}

export function TestCompletion({ studentName, answers, onViewResults }: TestCompletionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 animate-pulse">
            <CircleCheck className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-3xl font-semibold mb-3">Test Submitted Successfully!</h1>
          <p className="text-gray-600 mb-8">
            Thank you, {studentName}. Your IELTS test has been submitted.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="p-4 bg-blue-50">
              <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Questions</p>
              <p className="text-xl font-semibold">{Object.keys(answers).length}</p>
            </Card>
            <Card className="p-4 bg-purple-50">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Time Taken</p>
              <p className="text-xl font-semibold">52m 34s</p>
            </Card>
            <Card className="p-4 bg-green-50">
              <CircleCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Status</p>
              <Badge className="mt-1">Completed</Badge>
            </Card>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold mb-3">What happens next?</h3>
            <ul className="text-sm text-gray-700 space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <CircleCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Your answers are being securely processed</span>
              </li>
              <li className="flex items-start gap-2">
                <CircleCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Results will be available within 2-3 business days</span>
              </li>
              <li className="flex items-start gap-2">
                <CircleCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>You will receive an email notification when results are ready</span>
              </li>
              <li className="flex items-start gap-2">
                <CircleCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Contact your test center for any questions</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-3 justify-center">
            {onViewResults && (
              <Button onClick={onViewResults}>
                View Submitted Answers
              </Button>
            )}
            <Button variant="outline">
              Exit Test
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Test ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>
      </Card>
    </div>
  );
}