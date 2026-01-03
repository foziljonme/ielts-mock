import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Eye,
  Save,
  Search
} from 'lucide-react';
import { mockTestSubmissions } from '../data/mockData';
import { TestSubmission, Tenant } from '../types';

interface TestSubmissionsPageProps {
  tenant: Tenant;
}

export function TestSubmissionsPage({ tenant }: TestSubmissionsPageProps) {
  const [submissions, setSubmissions] = useState<TestSubmission[]>(
    mockTestSubmissions.filter(s => s.tenantId === tenant.id)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<TestSubmission | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState('');

  const filteredSubmissions = submissions.filter(s =>
    s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingReview = submissions.filter(s => s.status === 'pending-review').length;
  const graded = submissions.filter(s => s.status === 'graded').length;

  const handleScoreChange = (section: string, score: number) => {
    setScores({ ...scores, [section]: score });
  };

  const handleSaveGrades = () => {
    if (!selectedSubmission) return;

    const updatedSubmission = { ...selectedSubmission };
    
    // Update section scores
    if (scores.listening !== undefined && updatedSubmission.sections.listening) {
      updatedSubmission.sections.listening.score = scores.listening;
    }
    if (scores.reading !== undefined && updatedSubmission.sections.reading) {
      updatedSubmission.sections.reading.score = scores.reading;
    }
    if (scores.writing !== undefined && updatedSubmission.sections.writing) {
      updatedSubmission.sections.writing.score = scores.writing;
    }
    if (scores.speaking !== undefined && updatedSubmission.sections.speaking) {
      updatedSubmission.sections.speaking.score = scores.speaking;
    }

    // Calculate overall score
    const sectionScores = [
      updatedSubmission.sections.listening?.score,
      updatedSubmission.sections.reading?.score,
      updatedSubmission.sections.writing?.score,
      updatedSubmission.sections.speaking?.score
    ].filter((s): s is number => s !== undefined);

    if (sectionScores.length > 0) {
      updatedSubmission.overallScore = Number(
        (sectionScores.reduce((sum, s) => sum + s, 0) / sectionScores.length).toFixed(2)
      );
    }

    updatedSubmission.status = 'graded';

    // Update submissions list
    setSubmissions(submissions.map(s => 
      s.id === selectedSubmission.id ? updatedSubmission : s
    ));

    setSelectedSubmission(updatedSubmission);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending-review': return 'bg-orange-100 text-orange-700';
      case 'graded': return 'bg-green-100 text-green-700';
      case 'published': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
              <p className="text-2xl font-semibold">{submissions.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Review</p>
              <p className="text-2xl font-semibold">{pendingReview}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Graded</p>
              <p className="text-2xl font-semibold">{graded}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Submissions table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Test Submissions</h2>
            <p className="text-sm text-gray-600">Review and grade student test responses</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by student name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Test Date</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Sections</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Overall Score</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>{submission.studentName}</TableCell>
                <TableCell>{submission.testDate}</TableCell>
                <TableCell>
                  {new Date(submission.submittedAt).toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {submission.sections.listening && (
                      <Badge variant="outline" className="text-xs">L</Badge>
                    )}
                    {submission.sections.reading && (
                      <Badge variant="outline" className="text-xs">R</Badge>
                    )}
                    {submission.sections.writing && (
                      <Badge variant="outline" className="text-xs">W</Badge>
                    )}
                    {submission.sections.speaking && (
                      <Badge variant="outline" className="text-xs">S</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(submission.status)}>
                    {submission.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {submission.overallScore ? (
                    <Badge variant="default">{submission.overallScore}</Badge>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setScores({
                            listening: submission.sections.listening?.score || 0,
                            reading: submission.sections.reading?.score || 0,
                            writing: submission.sections.writing?.score || 0,
                            speaking: submission.sections.speaking?.score || 0
                          });
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          Test Submission - {submission.studentName}
                        </DialogTitle>
                      </DialogHeader>

                      <Tabs defaultValue="responses" className="mt-4">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="responses">Responses</TabsTrigger>
                          <TabsTrigger value="grading">Grading</TabsTrigger>
                        </TabsList>

                        <TabsContent value="responses" className="space-y-6">
                          {/* Listening Section */}
                          {submission.sections.listening && (
                            <Card className="p-4">
                              <h3 className="font-semibold mb-3 flex items-center justify-between">
                                Listening Section
                                {submission.sections.listening.score !== undefined && (
                                  <Badge>Score: {submission.sections.listening.score}</Badge>
                                )}
                              </h3>
                              <div className="space-y-2">
                                {Object.entries(submission.sections.listening.answers).map(([qId, answer]) => (
                                  <div key={qId} className="p-2 bg-gray-50 rounded">
                                    <span className="font-medium text-sm">{qId}:</span>
                                    <span className="ml-2 text-sm">{answer}</span>
                                  </div>
                                ))}
                              </div>
                            </Card>
                          )}

                          {/* Reading Section */}
                          {submission.sections.reading && (
                            <Card className="p-4">
                              <h3 className="font-semibold mb-3 flex items-center justify-between">
                                Reading Section
                                {submission.sections.reading.score !== undefined && (
                                  <Badge>Score: {submission.sections.reading.score}</Badge>
                                )}
                              </h3>
                              <div className="space-y-2">
                                {Object.entries(submission.sections.reading.answers).map(([qId, answer]) => (
                                  <div key={qId} className="p-2 bg-gray-50 rounded">
                                    <span className="font-medium text-sm">{qId}:</span>
                                    <span className="ml-2 text-sm">{answer}</span>
                                  </div>
                                ))}
                              </div>
                            </Card>
                          )}

                          {/* Writing Section */}
                          {submission.sections.writing && (
                            <Card className="p-4">
                              <h3 className="font-semibold mb-3 flex items-center justify-between">
                                Writing Section
                                {submission.sections.writing.score !== undefined && (
                                  <Badge>Score: {submission.sections.writing.score}</Badge>
                                )}
                              </h3>
                              <div className="space-y-4">
                                {Object.entries(submission.sections.writing.answers).map(([qId, answer]) => (
                                  <div key={qId}>
                                    <Label className="text-sm font-medium">{qId}:</Label>
                                    <div className="mt-2 p-3 bg-gray-50 rounded border">
                                      <p className="text-sm whitespace-pre-wrap">{answer}</p>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-600">
                                      Word count: {answer.split(/\s+/).length}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Card>
                          )}

                          {/* Speaking Section */}
                          {submission.sections.speaking && (
                            <Card className="p-4">
                              <h3 className="font-semibold mb-3 flex items-center justify-between">
                                Speaking Section
                                {submission.sections.speaking.score !== undefined && (
                                  <Badge>Score: {submission.sections.speaking.score}</Badge>
                                )}
                              </h3>
                              <div className="space-y-2">
                                {Object.entries(submission.sections.speaking.answers).map(([qId, answer]) => (
                                  <div key={qId} className="p-2 bg-gray-50 rounded">
                                    <span className="font-medium text-sm">{qId}:</span>
                                    <span className="ml-2 text-sm">{answer}</span>
                                  </div>
                                ))}
                              </div>
                            </Card>
                          )}
                        </TabsContent>

                        <TabsContent value="grading" className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            {submission.sections.listening && (
                              <div>
                                <Label>Listening Score (0-9)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="9"
                                  step="0.5"
                                  value={scores.listening || 0}
                                  onChange={(e) => handleScoreChange('listening', Number(e.target.value))}
                                />
                              </div>
                            )}
                            
                            {submission.sections.reading && (
                              <div>
                                <Label>Reading Score (0-9)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="9"
                                  step="0.5"
                                  value={scores.reading || 0}
                                  onChange={(e) => handleScoreChange('reading', Number(e.target.value))}
                                />
                              </div>
                            )}
                            
                            {submission.sections.writing && (
                              <div>
                                <Label>Writing Score (0-9)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="9"
                                  step="0.5"
                                  value={scores.writing || 0}
                                  onChange={(e) => handleScoreChange('writing', Number(e.target.value))}
                                />
                              </div>
                            )}
                            
                            {submission.sections.speaking && (
                              <div>
                                <Label>Speaking Score (0-9)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="9"
                                  step="0.5"
                                  value={scores.speaking || 0}
                                  onChange={(e) => handleScoreChange('speaking', Number(e.target.value))}
                                />
                              </div>
                            )}
                          </div>

                          <div>
                            <Label>Feedback (Optional)</Label>
                            <Textarea
                              placeholder="Add feedback for the student..."
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              rows={4}
                            />
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button onClick={handleSaveGrades} className="flex-1">
                              <Save className="w-4 h-4 mr-2" />
                              Save Grades
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
