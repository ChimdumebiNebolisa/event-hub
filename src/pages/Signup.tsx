import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

const Signup = () => {
  const { signInWithGoogle, signInWithMicrosoft } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoadingProvider('google');
    try {
      const user = await signInWithGoogle();
      console.log('Google sign in successful:', user);
      toast.success('Successfully signed in with Google!');
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (error: unknown) {
      console.error('Google sign in failed:', error);
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign in cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup blocked. Please allow popups for this site.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        toast.error('Sign in cancelled. Please try again.');
      } else {
        toast.error(`Sign in failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleMicrosoftSignIn = async () => {
    setLoadingProvider('microsoft');
    try {
      const user = await signInWithMicrosoft();
      console.log('Microsoft sign in successful:', user);
      toast.success('Successfully signed in with Microsoft!');
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (error: unknown) {
      console.error('Microsoft sign in failed:', error);
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign in cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup blocked. Please allow popups for this site.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        toast.error('Sign in cancelled. Please try again.');
      } else if (error.code === 'auth/operation-not-allowed') {
        toast.error('Microsoft sign-in is not enabled. Please check Firebase configuration.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        toast.error('An account with this email already exists using Google sign-in. Please sign in with Google first, then link your Microsoft account from the dashboard.');
      } else {
        toast.error(`Sign in failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-glow p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome to EventHub
            </h1>
            <p className="text-muted-foreground">
              Sign in to get started with unified calendar management
            </p>
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full bg-primary text-white hover:bg-primary/90"
              onClick={handleGoogleSignIn}
              disabled={loadingProvider !== null}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loadingProvider === 'google' ? "Signing in..." : "Sign in with Google"}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full border-2 hover:bg-gray-50"
              onClick={handleMicrosoftSignIn}
              disabled={loadingProvider !== null}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#0078d4"
                  d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"
                />
              </svg>
              {loadingProvider === 'microsoft' ? "Signing in..." : "Sign in with Microsoft"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Connect your Google or Microsoft account to get started
            </p>
          </div>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link 
                to="/signin" 
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => (window.location.href = "/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
