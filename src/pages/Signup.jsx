import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {Mail, Lock, Eye, EyeOff, User} from 'lucide-react';
import '../css/signup.css';


export default function Signup() {
    //form inputs
    const[firstName, setFirstName] = useState('');
    const[lastName, setLastName] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[confirmPassword, setConfirmPassword] = useState('');
    const[showPassword, setShowPassword] = useState(false);
    const[error, setError] = useState('');
    const[loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
    

        //copied from Login.jsx with a little modification
        // Simulate API call (replace with real API in production)
        setTimeout(() => {
        // Validate that both fields are filled
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
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

        if(password !== confirmPassword){
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        // Mock login success - in production, verify with backend
        console.log('Signup successful:', { firstName, lastName, email, password });
        setLoading(false);
        // Redirect to home page after successful login
        navigate('/');
        }, 1000);
    };

    return (
        <div className = "signup-container">
            <div className="signup-box">
                <h1 className="signup-title">Create Account</h1>
                <p className="signup-subtitle">Sign up to get started</p>

                {/* Error message display - only shows if there's an error */}
                {error && <div className="signup-error">{error}</div>}

                <form onSubmit={handleSignup} className="signup-form">
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
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>


                    
                    <div className = "form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className ="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id = "confirmPassword"
                                placeholder  = "Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className= "form-input"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="signup-button"
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>

                    <p className="signup-link">
                        Already have an account? <Link to="/login">Sign in here</Link>
                    </p>


                </form>

            </div>
        </div>
    )
}