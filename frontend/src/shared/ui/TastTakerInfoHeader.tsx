export const TestTakerInfoHeader = ({
  testTakenInfo,
}: {
  testTakenInfo: {
    id: string;
    name: string;
  };
}) => {
  return (
    <div className="bg-white border-b px-6 py-2 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <p>Test Taker ID: {testTakenInfo.id}</p>
          <h1 className="text-xl font-semibold">{testTakenInfo.name}</h1>
          {/* <p className="text-sm text-gray-600">
            Questions answered: {answeredCount} / {totalQuestions}
          </p> */}
        </div>
        <div className="flex items-center gap-4">
          {/* <TestTimer
            duration={section.duration}
            onTimeUp={handleTimeUp}
            isActive={true}
          />
          <Button onClick={() => setShowSubmitConfirm(true)} size="lg">
            Submit Test
          </Button> */}
        </div>
      </div>
    </div>
  );
};
