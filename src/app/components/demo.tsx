import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ArrowRight, X } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import bcrypt from 'bcryptjs';
import toast from 'react-hot-toast';

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

  // 🔥 NEW STATES
  const [step, setStep] = useState<"login" | "forgot" | "reset">("login");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    }

    if (step === "login" && !formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 UPDATED HANDLE SUBMIT
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
          toast.error('Invalid password');
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

        const res = await fetch("http://localhost:3000/api/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error);
          setIsSubmitting(false);
          return;
        }

        toast.success("OTP sent to email");
        setStep("reset");
      }

      // 🔑 RESET PASSWORD
      if (step === "reset") {

        const res = await fetch("http://localhost:3000/api/reset-password", {
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
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[101] p-4"
          >
            <div className="bg-[#f8f9fa] rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center pt-8 pb-6 px-6 sm:px-10 relative border border-slate-100">

              <button onClick={onClose} className="absolute top-4 right-4 p-2">
                <X size={20} />
              </button>

              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <Lock size={28} />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {step === "login" && "Welcome Back"}
                {step === "forgot" && "Forgot Password"}
                {step === "reset" && "Reset Password"}
              </h2>

              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">

                {/* EMAIL */}
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border rounded-xl px-4 py-3"
                />

                {/* PASSWORD */}
                {step === "login" && (
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full border rounded-xl px-4 py-3"
                  />
                )}

                {/* OTP + NEW PASSWORD */}
                {step === "reset" && (
                  <>
                    <input
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full border rounded-xl px-4 py-3"
                    />

                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border rounded-xl px-4 py-3"
                    />
                  </>
                )}

                {/* FORGOT LINK */}
                {step === "login" && (
                  <button
                    type="button"
                    onClick={() => setStep("forgot")}
                    className="text-xs text-blue-600"
                  >
                    Forgot password?
                  </button>
                )}

                <button
                  type="submit"
                  className="bg-blue-600 text-white py-3 rounded-xl"
                >
                  {step === "login" && "Sign In"}
                  {step === "forgot" && "Send OTP"}
                  {step === "reset" && "Reset Password"}
                </button>
              </form>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}