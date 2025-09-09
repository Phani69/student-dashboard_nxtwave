import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, BookOpen, Calendar, Edit, Save, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StudentProfile {
  _id: string;
  name: string;
  email: string;
  course: string;
  enrollmentDate: string;
}

const StudentDashboard = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<StudentProfile>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual backend call
      const response = await fetch('/api/students/profile');
      const data = await response.json();
      
      if (response.ok) {
        setProfile(data);
        setEditedProfile(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!profile) return;
    
    try {
      const response = await fetch(`/api/students/${profile._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedProfile),
      });
      
      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile || {});
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!profile && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No profile found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Student Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-elegant">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  My Profile
                </CardTitle>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveChanges}
                      className="bg-gradient-primary gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Profile Picture Placeholder */}
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
              </div>
              
              {/* Profile Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editedProfile.name || ''}
                        onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{profile?.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editedProfile.email || ''}
                        onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{profile?.email}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  {isEditing ? (
                    <Input
                      id="course"
                      value={editedProfile.course || ''}
                      onChange={(e) => setEditedProfile({...editedProfile, course: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="secondary">{profile?.course}</Badge>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Enrollment Date</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.enrollmentDate ? new Date(profile.enrollmentDate).toLocaleDateString() : 'N/A'}</span>
                    <Badge variant="outline" className="ml-auto">Read Only</Badge>
                  </div>
                </div>
              </div>
              
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <Card className="bg-gradient-primary text-white">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">1</div>
                    <div className="text-sm opacity-90">Active Course</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-secondary">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">
                      {profile?.enrollmentDate ? 
                        Math.floor((new Date().getTime() - new Date(profile.enrollmentDate).getTime()) / (1000 * 60 * 60 * 24))
                        : 0
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Days Enrolled</div>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">Active</div>
                    <div className="text-sm text-muted-foreground">Status</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;