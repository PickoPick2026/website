import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Lock, ArrowRight, X, Phone } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import {toast } from 'sonner';
import { useRef, useEffect } from "react";
import intlTelInput from "intl-tel-input";




interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick?: () => void;
}

export function RegisterModal({ isOpen, onClose, onLoginClick }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '', 
    password: '',
    agreeTerms: false,
  });
  const phoneRef = useRef<HTMLInputElement | null>(null);
const itiRef = useRef<any>(null);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  

const validate = () => {
  const newErrors: Record<string, string> = {};

  if (!formData.fullName.trim()) {
    newErrors.fullName = "Full name is required";
  }
  if (!formData.phoneNumber.trim()) {
    newErrors.phoneNumber = "Mobile number is required";
  }
  

  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = "Invalid email";
  }



  // ✅ PASSWORD VALIDATION
  if (!formData.password) {
    newErrors.password = "Password required";
  } else if (formData.password.length < 8) {
    newErrors.password = "Minimum 8 characters required";
  }

  if (!formData.agreeTerms) {
    newErrors.agreeTerms = "Accept terms";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSendOtp = async () => {
  if (!formData.email) {
    toast.error("Enter email first");
    return;
  }

  try {
    // ✅ CHECK EMAIL EXISTS FIRST
    const checkRes = await fetch("/api/check-user-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: formData.email.trim().toLowerCase()
      })
    });

    const checkData = await checkRes.json();

    if (checkData.exists) {
      toast.error("Email already registered");
      return;
    }

    // ✅ SEND OTP
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: formData.email,
        name: formData.fullName
      })
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error);
      return;
    }

    toast.success("OTP sent successfully ✅");
    setOtpSent(true);

  } catch {
    toast.error("Failed to send OTP");
  }
};

const handleVerifyOtp = async () => {
  try {
    if (!formData.email || !otp) {
      toast.error("Enter email and OTP");
      return;
    }

    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email.trim().toLowerCase(),
        otp: String(otp),
      }),
    });

    const data = await res.json();

    console.log("STATUS:", res.status);
    console.log("DATA:", data);

    if (!res.ok) {
      const message = data?.error || "Verification failed";

      toast.error(message);
      return;
    }

    toast.success("OTP verified successfully ✅");
    setOtpVerified(true);

  } catch (err: any) {
    console.error("FETCH ERROR:", err);
    toast.error("Network error");
  }
};

// const handleRegister = async (e: React.FormEvent) => {
//   e.preventDefault();
//    if (!otpVerified || !otp) {
//   toast.error("Please verify OTP first");
//   return;
// }

//   if (!validate()) return;

//   setIsSubmitting(true);

//   try {
//     const [firstName, ...rest] = formData.fullName.trim().split(' ');
//     const lastName = rest.join(' ') || '';

//     const hashedPassword = await bcrypt.hash(formData.password, 10);

//     const { data, error } = await supabase
//       .from('customerList')
//       .insert([
//         {
//           firstName,
//           lastName,
//           phoneNumber: '',
//           emailID: formData.email,
//           password: hashedPassword,
//           customerStatus: true
//         }
//       ])
//       .select();

//     if (error) {
//       setErrors({ form: error.message });
//       toast.error(error.message);
//       setIsSubmitting(false);
//       return;
//     }



//    const user = data[0];

// // ✅ FIRE AND FORGET (safe)
// fetch("https://pickopick.com/api/send-email", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({
//     email: formData.email,
//     name: formData.fullName
//   })
// })
// .then(() => console.log("Email triggered"))
// .catch(err => console.error("Email failed:", err));

// // ✅ UI continues immediately
// localStorage.setItem('user', JSON.stringify(user));

// toast.success(`Welcome! Your ID: ${user.pickID}`);
// setTimeout(() => {
//   onClose();
// }, 500);
//   } catch (err) {
//     toast.error('Something went wrong');
//     setErrors({ form: 'Something went wrong' });
//   }

  

//   setIsSubmitting(false);
// };
  
const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
if (!validate()) return;
  if (!otpVerified) {
    toast.error("Please verify OTP first");
    return;
  }

  

  setIsSubmitting(true);

  try {
    
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        otpVerified: true
      })
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Registration failed");
      setIsSubmitting(false);
      return;
    }

    // ✅ success
    const user = data.user;

    // optional email trigger
    fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: formData.email,
        name: formData.fullName
      })
    }).catch(err => console.error("Email failed:", err));

    localStorage.setItem('user', JSON.stringify(user));

    toast.success("Account created successfully!");

    setTimeout(() => {
      onClose();
      onLoginClick?.();
    }, 500);

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    toast.error("Something went wrong");
  }

  setIsSubmitting(false);
};
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[101] p-4"
          >
            <div className="bg-[#f8f9fa] rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center pt-8 pb-6 px-6 sm:px-10">
              
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              {/* Logo Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12L20 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12L4 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 5.25L8 9.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Header */}
              <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Create your account</h2>
              <p className="text-sm text-slate-600 mb-8 text-center">
                Already have an account? <button onClick={onLoginClick} className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 font-medium hover:underline">Sign in</button>
              </p>

              {errors.form && (
                <div className="w-full p-3 mb-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl text-center font-medium">
                  {errors.form}
                </div>
              )}

              {/* Form Card */}
              <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Full name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-lg outline-none transition-all ${
                          errors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                        }`}
                      />
                    </div>
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Mobile Number
                      </label>

                      <div className="relative">
                        {/* Phone Icon */}
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone size={16} className="text-slate-400" />
                        </div>

                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="Enter mobile number"
                          className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-lg outline-none transition-all ${
                            errors.phoneNumber
                              ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          }`}
                        />
                      </div>

                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                      )}
                    </div>        

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Email address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-slate-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-lg outline-none transition-all ${
                          errors.email ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={timer > 0}
                      className="text-blue-600 text-xs"
                    >
                      {timer > 0 ? `Resend in ${timer}s` : "Send OTP"}
                    </button>
                  </div>

                  {otpSent && (
                      <div className="mt-3">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm pr-10"
                          />

                          {/* ✅ Tick mark */}
                          {otpVerified && (
                            <span className="absolute right-3 top-2.5 text-green-600 font-bold">
                              ✓
                            </span>
                            
                          )}
                          
                        </div>

                        {/* ❌ Hide button after verified */}
                        {!otpVerified && (
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg text-sm"
                          >
                            Verify OTP
                          </button>
                        )}
                      </div>
                    )}

                  {/* Password */}
                  <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Password
                      </label>

                      <div className="relative">
                        {/* Left Icon */}
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={16} className="text-slate-400" />
                        </div>

                        {/* Input */}
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className={`w-full pl-10 pr-10 py-2.5 text-sm bg-white border rounded-lg outline-none transition-all ${
                            errors.password
                              ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          }`}
                        />

                        {/* 👁️ RIGHT SIDE BUTTON */}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </button>
                      </div>

                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                      )}
                    </div>

                  {/* Terms */}
                  <div className="mt-2">
                    <label className="flex items-start gap-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center mt-0.5">
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          className="peer appearance-none w-4 h-4 border border-slate-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer"
                        />
                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="text-xs text-slate-600 select-none">
                        I agree to the <a href="#" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 hover:underline">Terms</a> and <a href="#" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 hover:underline">Privacy Policy</a>
                      </span>
                    </label>
                    {errors.agreeTerms && <p className="text-red-500 text-xs mt-1 ml-6">{errors.agreeTerms}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 bg-gradient-to-br from-blue-600 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                  >
                    {isSubmitting ? 'Creating account...' : 'Create account'}
                    {!isSubmitting && <ArrowRight size={16} />}
                  </button>

                  {/* Divider 
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-slate-200"></div>
                    <span className="text-xs text-slate-500">Or continue with</span>
                    <div className="flex-1 h-px bg-slate-200"></div>
                  </div>
*/}
                  {/* Social Buttons 
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" className="flex items-center justify-center py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.8 15.71 17.58V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                        <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.58C14.72 18.24 13.47 18.64 12 18.64C9.16 18.64 6.75 16.72 5.88 14.16H2.21V17.01C4.01 20.59 7.71 23 12 23Z" fill="#34A853"/>
                        <path d="M5.88 14.16C5.66 13.5 5.53 12.77 5.53 12C5.53 11.23 5.66 10.5 5.88 9.84V6.99H2.21C1.47 8.46 1.04 10.18 1.04 12C1.04 13.82 1.47 15.54 2.21 17.01L5.88 14.16Z" fill="#FBBC05"/>
                        <path d="M12 5.36C13.62 5.36 15.06 5.92 16.2 7.01L19.35 3.86C17.45 2.09 14.97 1 12 1C7.71 1 4.01 3.41 2.21 6.99L5.88 9.84C6.75 7.28 9.16 5.36 12 5.36Z" fill="#EA4335"/>
                      </svg>
                    </button>
                    <button type="button" className="flex items-center justify-center py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12C2 16.42 4.865 20.17 8.838 21.5C9.338 21.59 9.52 21.28 9.52 21.02C9.52 20.79 9.511 20.15 9.506 19.31C6.725 19.91 6.138 17.97 6.138 17.97C5.683 16.82 5.027 16.51 5.027 16.51C4.12 15.89 5.096 15.9 5.096 15.9C6.099 15.97 6.626 16.93 6.626 16.93C7.517 18.46 8.963 18.02 9.539 17.76C9.629 17.11 9.89 16.67 10.18 16.42C7.96 16.17 5.626 15.31 5.626 11.47C5.626 10.38 6.015 9.48 6.65 8.78C6.548 8.53 6.205 7.51 6.747 6.14C6.747 6.14 7.582 5.87 9.497 7.17C10.29 6.95 11.146 6.84 12 6.84C12.854 6.84 13.71 6.95 14.504 7.17C16.418 5.87 17.252 6.14 17.252 6.14C17.795 7.51 17.452 8.53 17.35 8.78C17.986 9.48 18.373 10.38 18.373 11.47C18.373 15.32 16.036 16.17 13.81 16.41C14.17 16.72 14.49 17.33 14.49 18.27C14.49 19.62 14.478 20.71 14.478 21.02C14.478 21.28 14.658 21.6 15.168 21.5C19.138 20.16 22 16.42 22 12C22 6.477 17.523 2 12 2Z" fill="#475569"/>
                      </svg>
                    </button>
                  </div>
                  */}
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
