import { useState, useEffect } from 'react';
import { Calendar, UserX, Check, X, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import api from '@/utils/api';

const AbsentUsers = () => {
  const [absentUsers, setAbsentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Fetch absent users
  const fetchAbsentUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/attendance/absent-today');
      if (response.data.success) {
        setAbsentUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching absent users:', error);
      toast.error('Failed to fetch absent users');
    } finally {
      setLoading(false);
    }
  };

  // Mark selected users as absent
  const markAsAbsent = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    try {
      setMarking(true);
      const response = await api.post('/attendance/mark-absent', {
        userIds: selectedUsers,
        date: selectedDate
      });

      if (response.data.success) {
        toast.success(`Marked ${selectedUsers.length} users as absent`);
        setSelectedUsers([]);
        // Refresh both the absent users list and the dashboard data
        await Promise.all([
          fetchAbsentUsers(),
          // Trigger a custom event to refresh the dashboard
          new Promise(resolve => {
            window.dispatchEvent(new CustomEvent('refreshDashboard'));
            resolve();
          })
        ]);
      }
    } catch (error) {
      console.error('Error marking users as absent:', error);
      toast.error('Failed to mark users as absent');
    } finally {
      setMarking(false);
    }
  };

  // Toggle user selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Select all/none
  const toggleSelectAll = () => {
    if (selectedUsers.length === absentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(absentUsers.map(user => user._id));
    }
  };

  useEffect(() => {
    fetchAbsentUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Absent Users</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="bg-background border rounded px-2 py-1 text-sm"
            />
          </div>
          <Button 
            onClick={markAsAbsent}
            disabled={selectedUsers.length === 0 || marking}
            className="flex items-center gap-2"
          >
            {marking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Marking...
              </>
            ) : (
              <>
                <UserX className="h-4 w-4" />
                Mark Selected as Absent
              </>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users Who Haven't Marked Attendance Today</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : absentUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>All users have marked their attendance for today.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === absentUsers.length && absentUsers.length > 0}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absentUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => toggleUserSelection(user._id)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.employeeId || 'N/A'}</TableCell>
                      <TableCell>{user.department || 'N/A'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                          <X className="mr-1 h-3 w-3" />
                          Not Marked
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AbsentUsers;
