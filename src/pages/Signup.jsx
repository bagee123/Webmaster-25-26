import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {Mail, Lock, Eye, EyeOff, User} from 'lucide-react';
import '../css/signup.css';
import { auth, googleProvider } from '../config/firebase';
import {createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { 
  validateSignupForm, 
  validatePassword,
  sanitizeEmail, 
  sanitizeName 
} from '../utils/validation';

export default function Signup() {
    //form inputs
    const[firstName, setFirstName] = useState('');
    const[lastName, setLastName] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[confirmPassword, setConfirmPassword] = useState('');
    const[showPassword, setShowPassword] = useState(false);
    const[showConfirmPassword, setShowConfirmPassword] = useState(false);
    const[error, setError] = useState('');
    const[fieldErrors, setFieldErrors] = useState({});
    const[loading, setLoading] = useState(false);
    const[emailSent, setEmailSent] = useState(false);
    const navigate = useNavigate();

    // Handle field change and clear field-specific errors
    const handleFieldChange = (field, value, setter) => {
      setter(value);
      if (fieldErrors[field]) {
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
      setError('');
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});
        setLoading(true);
        
        // Comprehensive form validation
        const validation = validateSignupForm({
          firstName,
          lastName,
          email,
          password,
          confirmPassword
        });

        if (!validation.isValid) {
          setFieldErrors(validation.errors);
          setLoading(false);
          return;
        }

        try{
            // Create user with sanitized email
            const sanitizedEmail = sanitizeEmail(email);
            const userCredential = await createUserWithEmailAndPassword(auth, sanitizedEmail, password);
            const user = userCredential.user;

            // Send email verification
            await sendEmailVerification(user);
            setEmailSent(true);
            setLoading(false);

            // Redirect to home page - user is automatically logged in
            setTimeout(() => {
              navigate('/');
            }, 1500);

        }
        catch(error){
            // Map Firebase error codes to friendly messages
            const errorMessages = {
                'auth/email-already-in-use': 'This email is already registered. Please login or use a different email',
                'auth/weak-password': 'Password is too weak. Follow the password requirements shown above',
                'auth/invalid-email': 'Invalid email address. Please check and try again',
                'auth/operation-not-allowed': 'Email/password signup is not available. Please use Google Sign-up',
                'auth/too-many-requests': 'Too many signup attempts. Please try again later',
                'auth/network-request-failed': 'Network error. Please check your connection and try again',
            };
            
            const friendlyError = errorMessages[error.code] || error.message;
            setError(friendlyError);
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setError('');
        setFieldErrors({});
        setLoading(true);
        
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const user = userCredential.user;

            // For Google sign-in, email is already verified by Google
            // But we can still send verification email if needed
            if (!user.emailVerified) {
              await sendEmailVerification(user);
            }

            setLoading(false);
            
            // Redirect to home after successful Google signup
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } 
        catch(error){
            const errorMessages = {
                'auth/popup-closed-by-user': 'Sign-up was cancelled',
                'auth/popup-blocked': 'Sign-up popup was blocked. Please enable popups.',
                'auth/account-exists-with-different-credential': 'An account with this email already exists',
                'auth/network-request-failed': 'Network error. Please check your connection and try again',
            };
            
            const friendlyError = errorMessages[error.code] || error.message;
            setError(friendlyError);
            setLoading(false);
        }
    };

    const passwordValidation = validatePassword(password);

    return (
        <div className = "signup-container">
            <div className="signup-box">
                <h1 className="signup-title">Create Account</h1>
                <p className="signup-subtitle">Sign up to get started</p>

                {/* Error message display */}
                {error && <div className={`signup-${emailSent ? 'success' : 'error'}`}>{error}</div>}

                <form onSubmit={handleSignup} className="signup-form">
                    <div className = "form-row">
                        <div className = "form-group">
                            <label htmlFor="firstName">First Name</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    id = "firstName"
                                    placeholder  = "Enter your first name"
                                    value={firstName}
                                    onChange={(e) => handleFieldChange('firstName', e.target.value, setFirstName)}
                                    className={`form-input ${fieldErrors.firstName ? 'error' : ''}`}
                                />
                            </div>
                            {fieldErrors.firstName && <span className="field-error">{fieldErrors.firstName}</span>}
                        </div>

                        <div className = "form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <div className ="input-wrapper">
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    id = "lastName"
                                    placeholder  = "Enter your last name"
                                    value={lastName}
                                    onChange={(e) => handleFieldChange('lastName', e.target.value, setLastName)}
                                    className={`form-input ${fieldErrors.lastName ? 'error' : ''}`}
                                />
                            </div>
                            {fieldErrors.lastName && <span className="field-error">{fieldErrors.lastName}</span>}
                        </div>

                    </div>
                    <div className = "form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className ="input-wrapper">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                id = "email"
                                placeholder  = "Enter your email"
                                value={email}
                                onChange={(e) => handleFieldChange('email', e.target.value, setEmail)}
                                className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                            />
                        </div>
                        {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
                    </div>

                    <div className = "form-group">
                        <label htmlFor="password">Password</label>
                        <div className ="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id = "password"
                                placeholder  = "Enter your password"
                                value={password}
                                onChange={(e) => handleFieldChange('password', e.target.value, setPassword)}
                                className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                            />
                            {/* Button to toggle password visibility */}
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                        {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
                        <PasswordStrengthMeter password={password} showRequirements={true} />
                    </div>

                    <div className = "form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className ="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id = "confirmPassword"
                                placeholder  = "Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => handleFieldChange('confirmPassword', e.target.value, setConfirmPassword)}
                                className={`form-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
                            />
                            {/* Button to toggle password visibility */}
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                        {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !passwordValidation.isValid}
                        className="signup-button"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                    <div className="signup-divider">or</div>

                    <button 
                        type="button"
                        className="google-login" 
                        onClick={handleGoogleSignup}
                        disabled={loading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                            <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/>
                        </svg>
                        Sign up with Google
                    </button>
                    <p className="signup-link">
                        Already have an account? <Link to="/login">Sign in here</Link>
                    </p>


                </form>

            </div>
        </div>
    )
}