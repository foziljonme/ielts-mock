import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Clock, Headphones, Book, Pencil, Mic, AlertCircle } from 'lucide-react';

type SectionName = 'listening' | 'reading' | 'writing' | 'speaking';

interface SectionInstructionsProps {
  section: SectionName;
  duration: number;
  onReady: () => void;
  autoStartIn?: number; // seconds until auto-start
}

export function SectionInstructions({
  section,
  duration,
  onReady,
  autoStartIn = 10,
}: SectionInstructionsProps) {
  const [countdown, setCountdown] = useState(autoStartIn);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Auto-start when countdown reaches 0
      onReady();
    }
  }, [countdown, onReady]);

  const getSectionIcon = () => {
    switch (section) {
      case 'listening':
        return <Headphones className="w-12 h-12 text-blue-600" />;
      case 'reading':
        return <Book className="w-12 h-12 text-green-600" />;
      case 'writing':
        return <Pencil className="w-12 h-12 text-purple-600" />;
      case 'speaking':
        return <Mic className="w-12 h-12 text-orange-600" />;
    }
  };

  const getSectionColor = () => {
    switch (section) {
      case 'listening':
        return 'blue';
      case 'reading':
        return 'green';
      case 'writing':
        return 'purple';
      case 'speaking':
        return 'orange';
    }
  };

  const getSectionInstructions = () => {
    switch (section) {
      case 'listening':
        return [
          'You will hear the audio recording only ONCE',
          'Answer the questions as you listen',
          'You will have 10 minutes at the end to transfer your answers',
          'Write your answers clearly in the provided spaces',
          'Ensure your headphones are working properly',
        ];
      case 'reading':
        return [
          'Read the passages and answer all questions',
          'You may write on the question paper',
          'All answers must be written on the answer sheet',
          'Check your spelling and grammar carefully',
          'Manage your time wisely across all three passages',
        ];
      case 'writing':
        return [
          'You must complete BOTH tasks',
          'Task 1: Write at least 150 words (20 minutes recommended)',
          'Task 2: Write at least 250 words (40 minutes recommended)',
          'You will be penalized for writing under the word limit',
          'Plan your time carefully between both tasks',
        ];
      case 'speaking':
        return [
          'This section will be recorded',
          'Speak clearly and at a natural pace',
          'You will have time to prepare for Part 2',
          'Listen carefully to each question before responding',
          'If you don\'t understand, you may ask for clarification once',
        ];
    }
  };

  const color = getSectionColor();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className={`bg-${color}-600 p-8 text-white`}>
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                {getSectionIcon()}
              </div>
            </div>
            <h1 className="text-4xl font-bold text-center mb-2 capitalize">{section} Section</h1>
            <div className="flex items-center justify-center gap-2 text-white text-opacity-90">
              <Clock className="w-5 h-5" />
              <span className="text-lg">Duration: {duration} minutes</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Countdown */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Test Starting Soon</p>
                    <p className="text-sm text-gray-600">
                      Please read the instructions carefully
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-yellow-400">
                    <span className="text-3xl font-bold text-yellow-600">{countdown}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">seconds</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Important Instructions</h2>
              <div className="space-y-3">
                {getSectionInstructions().map((instruction, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-6 h-6 rounded-full bg-${color}-100 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <span className={`text-${color}-600 font-bold text-sm`}>
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-gray-700">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* General reminders */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-3">General Reminders</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>Do not communicate with other test takers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>Raise your hand if you need assistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>The timer will be visible throughout the test</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>Your answers will be auto-submitted when time expires</span>
                </li>
              </ul>
            </div>

            {/* Ready checkbox */}
            <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg mb-6">
              <input
                type="checkbox"
                id="ready-checkbox"
                checked={isReady}
                onChange={(e) => setIsReady(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="ready-checkbox" className="text-gray-700 font-medium cursor-pointer">
                I have read and understood the instructions
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4">
              <Button
                onClick={onReady}
                disabled={!isReady}
                className="flex-1 h-14 text-lg font-semibold"
              >
                I'm Ready - Start Now
              </Button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
              {countdown > 0
                ? `The test will start automatically in ${countdown} seconds`
                : 'Starting test now...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
