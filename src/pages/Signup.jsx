import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {Mail, Lock, Eye, EyeOff, User, Check, X as XIcon} from 'lucide-react';
import '../css/signup.css';
import { auth, googleProvider } from '../config/firebase';
import {createUserWithEmailAndPassword} from "firebase/auth";
import { signInWithPopup } from "firebase/auth";

// Password strength checker
const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    if (score <= 1) return { score, label: 'Weak', color: '#ef4444', checks };
    if (score <= 2) return { score, label: 'Fair', color: '#f59e0b', checks };
    if (score <= 3) return { score, label: 'Good', color: '#eab308', checks };
    if (score <= 4) return { score, label: 'Strong', color: '#22c55e', checks };
    return { score, label: 'Very Strong', color: '#10b981', checks };
};


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
    const[loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        // Validate that all fields are filled
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
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

        if(password !== confirmPassword){
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try{
            await createUserWithEmailAndPassword(auth, email, password);
            setLoading(false);
            // Redirect to login after successful signup
            setTimeout(() => {
                navigate('/login');
            }, 1000);

        }
        catch(error){

            // Map Firebase error codes to friendly messages
            const errorMessages = {
                'auth/email-already-in-use': 'This email is already registered. Please login or use a different email',
                'auth/weak-password': 'Password must be at least 6 characters long',
                'auth/invalid-email': 'Invalid email address',
                'auth/operation-not-allowed': 'Email/password signup is not available',
                'auth/too-many-requests': 'Too many signup attempts. Please try again later',
            };
            
            const friendlyError = errorMessages[error.code] || error.message;
            setError(friendlyError);
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setError('');
        setLoading(true);
        
        try {
            await signInWithPopup(auth, googleProvider);
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
            };
            
            const friendlyError = errorMessages[error.code] || error.message;
            setError(friendlyError);
            setLoading(false);
        }
    };

    return (
        <div className = "signup-container">
            <div className="signup-box">
                <h1 className="signup-title">Create Account</h1>
                <p className="signup-subtitle">Sign up to get started</p>

                {/* Error message display - only shows if there's an error */}
                {error && <div className="signup-error">{error}</div>}

                <form onSubmit={handleSignup} className="signup-form">
                    <div className = "form-row">
                        <div className = "form-group">
                            <label htmlFor="firstName">First Name</label>
                            <div className ="input-wrapper">
                                <User className="input-icon" size={20} />
                                
                                <input
                                    type="text"
                                    id = "firstName"
                                    placeholder  = "Enter your first name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className= "form-input"
                                />
                            </div>
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
                                    onChange={(e) => setLastName(e.target.value)}
                                    className= "form-input"
                                />
                            </div>
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
                                onChange={(e) => setEmail(e.target.value)}
                                className= "form-input"
                            />
                        </div>
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
                                onChange={(e) => setPassword(e.target.value)}
                                className= "form-input"
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
                        {/* Password strength indicator */}
                        {password && (
                            <div className="password-strength">
                                <div className="strength-bar-container">
                                    <div 
                                        className="strength-bar" 
                                        style={{ 
                                            width: `${(getPasswordStrength(password).score / 5) * 100}%`,
                                            backgroundColor: getPasswordStrength(password).color 
                                        }}
                                    />
                                </div>
                                <span className="strength-label" style={{ color: getPasswordStrength(password).color }}>
                                    {getPasswordStrength(password).label}
                                </span>
                                <div className="password-requirements">
                                    <div className={`requirement ${getPasswordStrength(password).checks?.length ? 'met' : ''}`}>
                                        {getPasswordStrength(password).checks?.length ? <Check size={12} /> : <XIcon size={12} />}
                                        <span>8+ characters</span>
                                    </div>
                                    <div className={`requirement ${getPasswordStrength(password).checks?.uppercase ? 'met' : ''}`}>
                                        {getPasswordStrength(password).checks?.uppercase ? <Check size={12} /> : <XIcon size={12} />}
                                        <span>Uppercase</span>
                                    </div>
                                    <div className={`requirement ${getPasswordStrength(password).checks?.number ? 'met' : ''}`}>
                                        {getPasswordStrength(password).checks?.number ? <Check size={12} /> : <XIcon size={12} />}
                                        <span>Number</span>
                                    </div>
                                </div>
                            </div>
                        )}
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
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className= "form-input"
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
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="signup-button"
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
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