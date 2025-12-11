import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import '../css/login.css';

/**
 * Login Page Component
 * Handles user authentication with email and password
 * Features: form validation, password visibility toggle, loading state, error handling
 */
export default function Login() {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Handles form submission and login validation
   * Currently simulates an API call with a 1-second delay
   * In production, this would send credentials to your backend
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call (replace with real API in production)
    setTimeout(() => {
      // Validate that both fields are filled
      if (!email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      // Basic email format validation
      if (!email.includes('@')) {
        setError('Please enter a valid email');
        setLoading(false);
        return;
      }

      // Mock login success - in production, verify with backend
      console.log('Login successful:', { email, password });
      setLoading(false);
      // Redirect to home page after successful login
      navigate('/');
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-box">
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
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#forgot" className="forgot-password">
              Forgot password?
            </a>
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

        {/* Google OAuth login button (placeholder for future integration) */}
        <button className="google-login">
          <img src="https://www.gstatic.com/firebaseapp/v8.10.1/images/firebaseui-icon-accounts.svg" alt="Google" />
          Sign in with Google
        </button>

        {/* Link to signup page for new users */}
        <p className="signup-link">
          Don&apos;t have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
}
