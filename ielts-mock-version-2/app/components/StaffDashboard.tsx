import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Monitor, 
  CircleCheck, 
  CircleAlert,
  Plus,
  Settings,
  Calendar,
  LogOut
} from 'lucide-react';
import { mockReservations, mockStudents, mockTenants } from '../data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TestSubmissionsPage } from './TestSubmissionsPage';

interface StaffDashboardProps {
  onLogout?: () => void;
}

export function StaffDashboard({ onLogout }: StaffDashboardProps) {
  const [reservations, setReservations] = useState(mockReservations);
  const tenant = mockTenants[0];
  const students = mockStudents.filter(s => s.tenantId === tenant.id);
  
  // Generate seat grid
  const totalSeats = tenant.totalSeats;
  const seatsPerRow = 6;
  const rows = Math.ceil(totalSeats / seatsPerRow);

  const getSeatStatus = (seatNumber: number) => {
    const reservation = reservations.find(r => r.seatNumber === seatNumber);
    if (!reservation) return 'available';
    return reservation.status;
  };

  const getSeatReservation = (seatNumber: number) => {
    return reservations.find(r => r.seatNumber === seatNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Staff Dashboard</h1>
              <p className="text-sm text-gray-600">{tenant.name} - Workstation Management</p>
            </div>
            <div className="flex items-center gap-2">
              {onLogout && (
                <Button variant="outline" onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Reservation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Reservation</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label>Select Student</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a student" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map(student => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Seat Number</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a seat" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: totalSeats }, (_, i) => i + 1)
                            .filter(n => getSeatStatus(n) === 'available')
                            .map(seatNum => (
                              <SelectItem key={seatNum} value={seatNum.toString()}>
                                Seat {seatNum}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Test Date</Label>
                      <Input type="date" />
                    </div>
                    <Button className="w-full">Create Reservation</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="workstations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="workstations">Workstations</TabsTrigger>
            <TabsTrigger value="submissions">Test Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="workstations">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Seat map */}
              <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Workstation Layout</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
                    <span className="text-sm">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-100 border-2 border-orange-500 rounded"></div>
                    <span className="text-sm">Reserved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
                    <span className="text-sm">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 border-2 border-gray-400 rounded"></div>
                    <span className="text-sm">Completed</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {Array.from({ length: rows }, (_, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-6 gap-4">
                    {Array.from({ length: seatsPerRow }, (_, colIndex) => {
                      const seatNumber = rowIndex * seatsPerRow + colIndex + 1;
                      if (seatNumber > totalSeats) return null;
                      
                      const status = getSeatStatus(seatNumber);
                      const reservation = getSeatReservation(seatNumber);
                      
                      return (
                        <Dialog key={seatNumber}>
                          <DialogTrigger asChild>
                            <button
                              className={`
                                relative aspect-square p-4 rounded-lg border-2 transition-all
                                hover:shadow-md cursor-pointer
                                ${status === 'available' ? 'bg-green-50 border-green-500 hover:bg-green-100' : ''}
                                ${status === 'reserved' ? 'bg-orange-50 border-orange-500 hover:bg-orange-100' : ''}
                                ${status === 'active' ? 'bg-blue-50 border-blue-500 hover:bg-blue-100' : ''}
                                ${status === 'completed' ? 'bg-gray-50 border-gray-400 hover:bg-gray-100' : ''}
                              `}
                            >
                              <Monitor className={`
                                w-6 h-6 mx-auto mb-1
                                ${status === 'available' ? 'text-green-600' : ''}
                                ${status === 'reserved' ? 'text-orange-600' : ''}
                                ${status === 'active' ? 'text-blue-600' : ''}
                                ${status === 'completed' ? 'text-gray-600' : ''}
                              `} />
                              <div className="text-center text-sm font-medium">{seatNumber}</div>
                            </button>
                          </DialogTrigger>
                          {reservation && (
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Seat {seatNumber} - Details</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 pt-4">
                                <div>
                                  <Label className="text-sm text-gray-600">Student</Label>
                                  <p className="font-medium">{reservation.studentName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-600">Access Code</Label>
                                  <code className="block bg-gray-100 px-3 py-2 rounded mt-1">
                                    {reservation.accessCode}
                                  </code>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-600">Test Date</Label>
                                  <p className="font-medium">{reservation.date}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-600">Status</Label>
                                  <Badge className="mt-1">{reservation.status}</Badge>
                                </div>
                                {status === 'reserved' && (
                                  <div className="flex gap-2 pt-4">
                                    <Button variant="outline" className="flex-1">
                                      <Settings className="w-4 h-4 mr-2" />
                                      Setup Workstation
                                    </Button>
                                    <Button variant="outline" className="flex-1 text-red-600 hover:bg-red-50">
                                      Cancel
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          )}
                        </Dialog>
                      );
                    })}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Reservation list */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Today's Reservations</h2>
              
              <div className="space-y-3">
                {reservations.filter(r => r.date === '2026-01-01').map((reservation) => (
                  <Card key={reservation.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`
                          w-8 h-8 rounded flex items-center justify-center
                          ${reservation.status === 'completed' ? 'bg-gray-100 text-gray-700' : ''}
                          ${reservation.status === 'active' ? 'bg-blue-100 text-blue-700' : ''}
                          ${reservation.status === 'reserved' ? 'bg-orange-100 text-orange-700' : ''}
                        `}>
                          {reservation.seatNumber}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{reservation.studentName}</p>
                          <code className="text-xs text-gray-600">{reservation.accessCode}</code>
                        </div>
                      </div>
                      {reservation.status === 'completed' && (
                        <CircleCheck className="w-5 h-5 text-green-500" />
                      )}
                      {reservation.status === 'active' && (
                        <CircleAlert className="w-5 h-5 text-blue-500 animate-pulse" />
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {reservation.status}
                    </Badge>
                  </Card>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-sm mb-2">Quick Setup Instructions</h3>
                <ol className="text-xs text-gray-700 space-y-1">
                  <li>1. Verify workstation is powered on</li>
                  <li>2. Check internet connectivity</li>
                  <li>3. Confirm audio equipment works</li>
                  <li>4. Student enters access code</li>
                  <li>5. Test begins automatically</li>
                </ol>
              </div>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="submissions">
        <TestSubmissionsPage tenant={tenant} />
      </TabsContent>
    </Tabs>
      </div>
    </div>
  );
}