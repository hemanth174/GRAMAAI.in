import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Building2, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('register'); // 'register', 'password', 'otp'
  const [hospitalName, setHospitalName] = useState('');
  const [emailName, setEmailName] = useState(''); // email prefix (before @gmail.com)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isRegistering, setIsRegistering] = useState(true); // true for register, false for login

  // Handle first step - Hospital Name and Email
  const handleFirstStep = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate inputs
    if (!hospitalName.trim()) {
      setError('Please enter hospital name');
      return;
    }

    if (!emailName.trim()) {
      setError('Please enter email name');
      return;
    }

    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!role.trim()) {
      setError('Please enter your role');
      return;
    }

    // Create full email
    const fullEmail = `${emailName.trim()}@gmail.com`;
    setEmail(fullEmail);

    // Move to password step
    setStep('password');
  };

  // Handle password step - Register or Login
  const handlePasswordStep = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      if (isRegistering) {
        // Register new hospital
        const response = await fetch('http://localhost:5000/register-hospital', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            hospitalName,
            email,
            password,
            fullName,
            phone,
            role,
            bio
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setSuccess('Registration successful! Sending OTP to your email...');

          if (data.hospital) {
            setHospitalName(data.hospital.hospitalName || hospitalName);
            setFullName(data.hospital.fullName || fullName);
            setPhone(data.hospital.phone || phone);
            setRole(data.hospital.role || role);
            setBio(data.hospital.bio || bio);
          }
          // Send OTP
          await sendOTPToEmail();
        } else {
          setError(data.message || 'Registration failed. Please try again.');
        }
      } else {
        // Login existing hospital
        const response = await fetch('http://localhost:5000/login-hospital', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setSuccess('Login successful! Sending OTP to your email...');
          if (data.hospital) {
            setHospitalName(data.hospital.hospitalName || hospitalName);
            setFullName(data.hospital.fullName || fullName);
            setPhone(data.hospital.phone || phone);
            setRole(data.hospital.role || role || 'admin');
            setBio(data.hospital.bio || bio);
            setEmail(data.hospital.email || email);
          }
          // Send OTP
          await sendOTPToEmail();
        } else {
          setError(data.message || 'Login failed. Please try again.');
        }
      }
    } catch (err) {
      setError('Network error. Please check if the server is running.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Send OTP to email
  const sendOTPToEmail = async () => {
    try {
      const response = await fetch('http://localhost:5000/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('OTP sent successfully! Please check your email.');
        setStep('otp');
        startCountdown();
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
      console.error('Error sending OTP:', err);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Login successful! Redirecting...');

        const userPayload = data.user || {};
        const normalizedUser = {
          id: userPayload.id,
          hospitalName: userPayload.hospitalName || hospitalName,
          hospital_name: userPayload.hospital_name || hospitalName,
          email: userPayload.email || email,
          fullName: userPayload.fullName || fullName,
          full_name: userPayload.full_name || userPayload.fullName || fullName,
          phone: userPayload.phone ?? phone,
          role: userPayload.role || role || 'admin',
          bio: userPayload.bio ?? bio,
          loggedIn: true,
          loginTime: Date.now()
        };

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        setHospitalName(normalizedUser.hospitalName);
        setFullName(normalizedUser.full_name || normalizedUser.fullName || '');
        setPhone(normalizedUser.phone || '');
        setRole(normalizedUser.role || 'admin');
        setBio(normalizedUser.bio || '');
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error verifying OTP:', err);
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer for resend OTP
  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Resend OTP
  const handleResendOTP = () => {
    if (countdown > 0) return;
    setOtp('');
    sendOTPToEmail();
  };

  // Go back to previous step
  const handleBackStep = () => {
    setError('');
    setSuccess('');
    if (step === 'password') {
      setStep('register');
      setPassword('');
    } else if (step === 'otp') {
      setStep('password');
      setOtp('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-xl">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hospital Management System</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Welcome! Please log in to your hospital portal. Select your hospital from the list below. 
            Only the hospitals registered with our system will appear here. Your hospital name will also 
            be displayed in the app header once you log in.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className={`flex items-center ${step === 'register' ? 'text-blue-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'register' ? 'bg-blue-100 border-2 border-blue-600' : 'bg-green-100'
              }`}>
                {step !== 'register' ? <CheckCircle className="w-5 h-5" /> : <span className="font-semibold">1</span>}
              </div>
              <span className="ml-2 text-sm font-medium">Hospital Info</span>
            </div>
            
            <div className={`h-0.5 w-12 mx-2 ${step === 'otp' ? 'bg-green-600' : step === 'password' ? 'bg-blue-600' : 'bg-gray-200'}`} />
            
            <div className={`flex items-center ${step === 'password' ? 'text-blue-600' : step === 'otp' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'password' ? 'bg-blue-100 border-2 border-blue-600' : step === 'otp' ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {step === 'otp' ? <CheckCircle className="w-5 h-5" /> : <span className="font-semibold">2</span>}
              </div>
              <span className="ml-2 text-sm font-medium">Password</span>
            </div>

            <div className={`h-0.5 w-12 mx-2 ${step === 'otp' ? 'bg-blue-600' : 'bg-gray-200'}`} />
            
            <div className={`flex items-center ${step === 'otp' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'otp' ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100'
              }`}>
                <span className="font-semibold">3</span>
              </div>
              <span className="ml-2 text-sm font-medium">Verify OTP</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {/* Step 1: Hospital Name and Email */}
          {step === 'register' && (
            <form onSubmit={handleFirstStep} className="space-y-6">
              {/* Toggle between Register and Login */}
              <div className="flex justify-center mb-4">
                <div className="inline-flex rounded-lg border border-gray-200 p-1">
                  <button
                    type="button"
                    onClick={() => setIsRegistering(true)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isRegistering
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Register
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      !isRegistering
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Login
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="hospitalName" className="text-sm font-medium text-gray-700 mb-2 block">
                  Hospital Name
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="hospitalName"
                    type="text"
                    placeholder="Enter hospital name"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="pl-10 h-12"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="emailName" className="text-sm font-medium text-gray-700 mb-2 block">
                  Email Address
                </Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <Input
                    id="emailName"
                    type="text"
                    placeholder="emailname"
                    value={emailName}
                    onChange={(e) => setEmailName(e.target.value)}
                    className="pl-10 pr-32 h-12"
                    required
                    disabled={loading}
                  />
                  <span className="absolute right-3 text-gray-500 font-medium">@gmail.com</span>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {isRegistering ? 'Use your Gmail address for management login' : 'Enter your registered Gmail'}
                </p>
              </div>

              <div>
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-2 block">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-12"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="role" className="text-sm font-medium text-gray-700 mb-2 block">
                  Role
                </Label>
                <Input
                  id="role"
                  type="text"
                  placeholder="e.g., Doctor, Administrator, Nurse"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-12"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                  Phone Number (Optional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="bio" className="text-sm font-medium text-gray-700 mb-2 block">
                  Bio (Optional)
                </Label>
                <textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="3"
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={loading}
              >
                <span className="flex items-center justify-center">
                  Continue
                  <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              </Button>
            </form>
          )}

          {/* Step 2: Password */}
          {step === 'password' && (
            <form onSubmit={handlePasswordStep} className="space-y-6">
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {isRegistering ? 'Minimum 6 characters required' : 'Enter your password to continue'}
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>{isRegistering ? 'Registering' : 'Logging in'} as:</strong><br />
                  {hospitalName} ({email})
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handleBackStep}
                  variant="outline"
                  className="flex-1 h-12"
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      {isRegistering ? 'Register & Send OTP' : 'Login & Send OTP'}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <Label htmlFor="otp" className="text-sm font-medium text-gray-700 mb-2 block">
                  Enter OTP
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="pl-10 h-12 text-center text-2xl tracking-widest font-semibold"
                    required
                    disabled={loading}
                    maxLength={6}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  OTP sent to <span className="font-medium text-gray-700">{email}</span>
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Verify & Login
                    <CheckCircle className="ml-2 w-5 h-5" />
                  </span>
                )}
              </Button>

              {/* Resend OTP */}
              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={countdown > 0}
                  className={`text-sm font-medium ${
                    countdown > 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-600 hover:text-blue-700 cursor-pointer'
                  }`}
                >
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                </button>
                
                <div>
                  <button
                    type="button"
                    onClick={handleBackStep}
                    className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                  >
                    ← Go back
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            🔒 Your data is secure and encrypted
          </p>
          <p className="text-xs text-gray-500 mt-2">
            © 2025 Hospital Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
