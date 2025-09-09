import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Users, BookOpen, Shield, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="relative z-10 container mx-auto px-6 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Student
              </span>{' '}
              Management{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                System
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
              A comprehensive MERN stack application for managing students with role-based access control,
              authentication, and powerful dashboard features.
            </p>
            
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
                >
                  <Link to={user.role === 'admin' ? '/admin' : '/student'}>
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
                >
                  <Link to="/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="text-lg px-8 py-6">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
          <p className="text-xl text-muted-foreground">
            Built with modern technologies and best practices
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-elegant border-0 bg-gradient-to-br from-card to-muted/20 hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Authentication & RBAC</CardTitle>
              <CardDescription>
                Secure JWT-based authentication with role-based access control for admins and students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Email verification</li>
                <li>• Password reset functionality</li>
                <li>• Protected routes</li>
                <li>• Secure password hashing</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant border-0 bg-gradient-to-br from-card to-muted/20 hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>
                Comprehensive student management with full CRUD operations and pagination
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• View all students</li>
                <li>• Add new students</li>
                <li>• Edit student information</li>
                <li>• Delete students</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant border-0 bg-gradient-to-br from-card to-muted/20 hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Student Portal</CardTitle>
              <CardDescription>
                Personalized dashboard for students to view and update their profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• View personal profile</li>
                <li>• Update contact information</li>
                <li>• Course enrollment tracking</li>
                <li>• Progress statistics</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="bg-muted/50">
        <div className="container mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built with Modern Technologies</h2>
            <p className="text-xl text-muted-foreground">
              MERN Stack with best practices and security features
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'MongoDB', description: 'NoSQL Database' },
              { name: 'Express.js', description: 'Backend Framework' },
              { name: 'React.js', description: 'Frontend Library' },
              { name: 'Node.js', description: 'Runtime Environment' }
            ].map((tech, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-card shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{tech.name}</h3>
                <p className="text-muted-foreground">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="container mx-auto px-6 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join our learning management system today and experience the power of modern web development.
            </p>
            <Button 
              asChild 
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
            >
              <Link to="/signup">
                Create Your Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
