import { Card } from "../../../shared/ui/card";

export const SectionInfo = () => {
  return (
    <Card className="mb-6 p-4 gap-1 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-3">
        <span className="text-m font-bold">Part 1</span>
      </div>
      <p className="text-s text-gray-600">
        Listen and answer the questions 1-10
      </p>
    </Card>
  );
};
