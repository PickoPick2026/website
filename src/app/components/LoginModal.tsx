import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ArrowRight, X, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import bcrypt from 'bcryptjs';
import {toast } from 'sonner';
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick?: () => void;
}

export function LoginModal({ isOpen, onClose, onRegisterClick }: LoginModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"login" | "forgot" | "reset">("login");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

  
     if (step === "login" && !formData.password) {
      newErrors.password = 'Password is required';
    }

            if (step === "login") {
          if (!formData.password) {
            newErrors.password = "Password is required";
          } else if (formData.password.length < 8) {
            newErrors.password = "Minimum 8 characters required";
          }
        }

        if (step === "reset") {
          if (!otp) {
            newErrors.otp = "OTP required";
          }

          if (!newPassword) {
            newErrors.newPassword = "Password required";
          } else if (newPassword.length < 8) {
            newErrors.newPassword = "Minimum 8 characters required";
          }
        }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleForgotPassword = async () => {
  if (!formData.email) {
    toast.error("Enter email first");
    return;
  }

  try {
    const res = await fetch("https://pickopick.com/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: formData.email }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error);
      return;
    }

    toast.success("OTP sent to your email");

    //  next step: open OTP modal
  } catch (err) {
    toast.error("Something went wrong");
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {

      // ✅ LOGIN FLOW (UNCHANGED)
      if (step === "login") {

        const { data, error } = await supabase
          .from('customerList')
          .select('*')
          .eq('emailID', formData.email)
          .single();

        if (error || !data) {
          toast.error('User not found');
          setIsSubmitting(false);
          return;
        }

        const isValid = await bcrypt.compare(formData.password, data.password);

        if (!isValid) {
          setErrors({ form: 'Invalid password' });
         toast.error("Incorrect password ❌");
          setIsSubmitting(false);
          return;
        }

        localStorage.setItem(
          "user",
          JSON.stringify({
            customerID: data.customerID,
            firstName: data.firstName,
            phoneNumber: data.phoneNumber,
            emailID: data.emailID,
          })
        );

        toast.success('Login successful!');
        window.dispatchEvent(new Event('auth-change'));
        onClose();
      }

      // 📩 SEND OTP
      if (step === "forgot") {

  if (!formData.email) {
    toast.error("Enter email first");
    setIsSubmitting(false);
    return;
  }

  try {
    // ✅ CHECK EMAIL EXISTS
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

    console.log("CHECK EMAIL RESPONSE:", checkData);

    if (!checkData.exists) {
      toast.error("Email not registered ❌");
      setIsSubmitting(false);
      return;
    }

    // ✅ SEND OTP
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: formData.email,
        name: "User"
      })
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error);
      setIsSubmitting(false);
      return;
    }

    toast.success("OTP sent successfully ✅");
    setStep("reset");

  } catch {
    toast.error("Failed to send OTP");
  }
}

      // 🔑 RESET PASSWORD
      if (step === "reset") {

         console.log("SENDING:", {
            email: formData.email,
            otp,
            newPassword
          });


        const res = await fetch("/api/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            otp,
            newPassword,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error);
          setIsSubmitting(false);
          return;
        }

        toast.success("Password updated");
        setStep("login");
      }

    } catch (err) {
      toast.error('Something went wrong');
    }

    setIsSubmitting(false);
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
            <div className="bg-white rounded-3xl overflow-hidden flex flex-col items-center pt-8 pb-6 px-6 sm:px-10 relative border border-slate-200">
              
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-extrabold tracking-tight text-[#0A1931] mt-2 mb-2 text-center">Welcome Back</h2>
              <p className="text-slate-500 text-sm mb-8 text-center px-4">
                Enter your credentials to access your account.
              </p>

              {errors.form && (
                <div className="w-full p-3 mb-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl text-center font-medium">
                  {errors.form}
                </div>
              )}

              {step !== "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      if (step === "reset") {
                        setStep("forgot"); // go back one step
                      } else {
                        setStep("login");
                      }
                    }}
                    className="text-sm text-blue-600 mb-4 hover:underline"
                  >
                    ← Back
                  </button>
                )}

              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                
                {/* Email Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={`w-full bg-white border ${errors.email ? 'border-red-300 focus:border-blue-500 focus:ring-blue-500/20' : 'border-slate-200 focus:border-[#0B56D9] focus:ring-[#0B56D9]/20'} text-slate-900 text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-4 transition-all`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 ml-1 mt-0.5">{errors.email}</p>}
                </div>

                {/* Password Input */}
                {step === "login" && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-semibold text-slate-700">Password</label>
                      <button
                        type="button"
                        onClick={() => setStep("forgot")}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>

<div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                  </div>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full bg-white border ${
                      errors.password
                        ? "border-red-300 focus:border-[#0B56D9] focus:ring-[#0B56D9]/20"
                        : "border-slate-200 focus:border-[#0B56D9] focus:ring-[#0B56D9]/20"
                    } text-slate-900 text-sm rounded-xl pl-10 pr-10 py-3 outline-none focus:ring-4 transition-all`}
                  />

                  {/* Eye toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                    {errors.password && (
                      <p className="text-xs text-red-500 ml-1 mt-0.5">{errors.password}</p>
                    )}
                  </div>
                )}

                {step === "reset" && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700 ml-1">OTP</label>
                      <input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="w-full bg-white border border-slate-200 text-sm rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-[#0B56D9]/20"
                      />
                    </div>

                   <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      className="w-full bg-white border border-slate-200 text-sm rounded-xl px-4 py-3 pr-10 outline-none focus:ring-4 focus:ring-[#0B56D9]/20"
                    />

                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  </>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 bg-[#0B56D9] hover:bg-[#0849B7] text-white py-3.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                     {step === "login" && "Sign In"}
                      {step === "forgot" && "Send OTP"}
                      {step === "reset" && "Reset Password"}
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-slate-200 w-full text-center">
                <p className="text-sm text-slate-600">
                  Don't have an account?{' '}
                  <button type="button" onClick={onRegisterClick} className="text-[#0B56D9] font-bold hover:text-[#0849B7] transition-colors">
                    Sign up
                  </button>
                </p>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
