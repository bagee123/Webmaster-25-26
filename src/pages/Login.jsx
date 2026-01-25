import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, X } from 'lucide-react';
import '../css/login.css';
import { auth, googleProvider } from '../config/firebase';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';

/**
 * Login Page Component
 * Handles user authentication with email and password
 * Features: form validation, password visibility toggle, loading state, error handling, success animation
 */
export default function Login() {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  // Load remembered email on mount
  useEffect(() => {
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    const savedEmail = localStorage.getItem('rememberEmail');
    if (savedRememberMe && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      await signInWithPopup(auth, googleProvider);
      
      // Save remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      
      // Show success animation
      setSuccess(true);
      setLoading(false);
      
      // Wait for animation, then redirect to home
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      
      const errorMessages = {
        'auth/popup-closed-by-user': 'Sign-in was cancelled',
        'auth/popup-blocked': 'Sign-in popup was blocked. Please enable popups.',
        'auth/account-exists-with-different-credential': 'An account with this email already exists',
      };
      
      const friendlyError = errorMessages[error.code] || error.message;
      setError(friendlyError);
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setResetSent(true);
      setForgotEmail('');
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetSent(false);
      }, 3000);
    } catch (error) {
      const errorMessages = {
        'auth/user-not-found': 'No account found with this email address',
        'auth/invalid-email': 'Invalid email address',
        'auth/too-many-requests': 'Too many requests. Please try again later',
      };
      setError(errorMessages[error.code] || error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles form submission and login validation
   * Uses Firebase Authentication for real login
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate that both fields are filled
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Basic email format validation
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) {
        setError('Please enter a valid email');
        setLoading(false);
        return;
    }

    try {
      // Attempt Firebase login
      await signInWithEmailAndPassword(auth, email, password);
      
      // Save remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('rememberEmail', email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('rememberEmail');
      }
      
      // Show success animation
      setSuccess(true);
      setLoading(false);
      
      // Wait for animation, then redirect to home
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      
      // Map Firebase error codes to friendly messages
      const errorMessages = {
        'auth/user-not-found': 'No account found with this email address',
        'auth/invalid-credential': 'Incorrect email or password',
        'auth/invalid-email': 'Invalid email address',
        'auth/user-disabled': 'This account has been disabled',
        'auth/too-many-requests': 'Too many failed login attempts. Please try again later',
      };
      
      const friendlyError = errorMessages[error.code] || error.message;
      setError(friendlyError);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className={`login-box ${success ? 'login-success' : ''}`}>
        {success ? (
          /* Success animation overlay */
          <div className="success-overlay">
            <CheckCircle size={64} className="success-icon" />
            <h2 className="success-title">Welcome!</h2>
            <p className="success-message">You&apos;ve successfully logged in</p>
          </div>
        ) : (
          <>
            {/* Page header */}
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your account</p>

            {/* Error message display - only shows if there's an error */}
            {error && <div className="login-error">{error}</div>}

            {/* Main login form */}
            <form onSubmit={handleLogin} className="login-form">
              {/* Email input field with icon */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Password input field with show/hide toggle */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                  />
                  {/* Button to toggle password visibility */}
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember me checkbox and forgot password link */}
              <div className="form-options">
                <label className="remember-me">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setError('');
                  }}
                  className="forgot-password"
                >
                  Forgot password?
                </button>
              </div>

              {/* Main submit button - shows loading state during login */}
              <button
                type="submit"
                disabled={loading}
                className="login-button"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Divider between traditional and social login */}
            <div className="login-divider">or</div>

            {/* Google OAuth login button */}
            <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="google-login"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/>
              </svg>
              Sign in with Google
            </button>

            {/* Link to signup page for new users */}
            <p className="signup-link">
              Don&apos;t have an account? <a href="/signup">Sign up here</a>
            </p>
          </>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="forgot-password-modal-overlay" onClick={() => setShowForgotPassword(false)}>
          <div className="forgot-password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="forgot-password-header">
              <h2>Reset Your Password</h2>
              <button 
                onClick={() => setShowForgotPassword(false)}
                className="forgot-close-btn"
              >
                <X size={24} />
              </button>
            </div>

            {resetSent ? (
              <div className="forgot-success-message">
                <CheckCircle size={48} className="success-icon" />
                <h3>Check Your Email</h3>
                <p>We&apos;ve sent a password reset link to <strong>{forgotEmail}</strong></p>
                <p className="forgot-subtitle">Follow the link in your email to reset your password</p>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="forgot-password-form">
                {error && (
                  <div className="forgot-error-message">
                    <AlertCircle size={20} />
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="forgot-email">Email Address</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={20} />
                    <input
                      type="email"
                      id="forgot-email"
                      placeholder="Enter your email address"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <p className="forgot-subtitle">
                  We&apos;ll send you an email with instructions to reset your password.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="login-button"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="forgot-cancel-btn"
                >
                  Back to Login
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
