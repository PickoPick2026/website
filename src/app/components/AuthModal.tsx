import { useEffect, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, X, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { signInWithGoogle, type PickUser } from '../../services/authService';

type AuthStep = 'google' | 'mobile';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simplified login: "Continue with Google" is the only auth method. Existing
// customers are matched by their Google email (same Pick ID / orders); new
// customers get their account + Pick ID created automatically. The only extra
// step is a one-time mobile number for accounts that don't have one yet.
export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [step, setStep] = useState<AuthStep>('google');
  const [googleUser, setGoogleUser] = useState<PickUser | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [welcomeEmailSent, setWelcomeEmailSent] = useState<boolean | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSavingPhone, setIsSavingPhone] = useState(false);

  // Every time the popup opens, start fresh from the Google step.
  useEffect(() => {
    if (isOpen) {
      setStep('google');
      setGoogleUser(null);
      setPhoneNumber('');
      setWelcomeEmailSent(null);
    }
  }, [isOpen]);

  const persistUser = (user: PickUser) => {
    if (!user.phoneNumber || String(user.phoneNumber).trim() === '') {
      setGoogleUser(user);
      setStep('mobile');
      return;
    }

    localStorage.setItem('user', JSON.stringify(user));
    window.dispatchEvent(new Event('auth-change'));
    toast.success(
      `Welcome${user.firstName ? `, ${user.firstName}` : ''}! You are signed in.`,
    );
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      persistUser(result.user);
      if (!result.user.phoneNumber || String(result.user.phoneNumber).trim() === '') {
        setWelcomeEmailSent(result.welcomeEmailSent ?? null);
        if (result.welcomeEmailSent === false) {
          toast.error('We could not send your Pick ID email. Please contact sales@pickopick.com if it does not arrive.');
        } else if (result.welcomeEmailSent) {
          toast.success('Your Pick ID was sent to your Google email.');
        }
        toast.info('One last step — add your mobile number to finish.');
      }
    } catch (error) {
      const code = (error as { code?: string })?.code;
      if (
        code === 'auth/popup-closed-by-request' ||
        code === 'auth/cancelled-popup-request' ||
        code === 'auth/popup-blocked'
      ) {
        toast.error('Google sign-in was cancelled or blocked. Please try again.');
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Google sign-in failed. Please try again.',
        );
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleMobileSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!googleUser) return;

    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length < 8) {
      toast.error('Please enter a valid mobile number.');
      return;
    }

    setIsSavingPhone(true);
    try {
      const response = await fetch('/api/auth/google-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: String(googleUser.emailID || '').toLowerCase(),
          phoneNumber: phoneNumber.trim(),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.user) {
        toast.error(data.error || 'Could not save your mobile number.');
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('auth-change'));
      toast.success(
        `Welcome${data.user.firstName ? `, ${data.user.firstName}` : ''}! Your account is ready.`,
      );
      onClose();
    } catch {
      toast.error('Could not save your mobile number. Please try again.');
    } finally {
      setIsSavingPhone(false);
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[101] p-4 max-h-[92dvh] overflow-y-auto"
          >
            <div className="bg-white rounded-3xl overflow-hidden flex flex-col items-center pt-8 pb-8 px-6 sm:px-10 relative border border-slate-200">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {step === 'google' ? (
                <>
                  <img
                    src="/PICKLogo.webp"
                    alt="Pick O Pick"
                    className="h-11 w-fit object-contain mt-1 mb-5"
                  />
                  <h2 className="text-2xl font-extrabold tracking-tight text-[#0A1931] text-center">
                    One click. You&apos;re in.
                  </h2>
                  <p className="mt-2 mb-7 text-sm leading-relaxed text-slate-500 text-center px-2">
                    Continue with Google to shop the Pick O Pick directory.
                    Existing customers are recognised by email — new ones get a
                    Pick ID instantly.
                  </p>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading}
                    className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-300 bg-white py-3.5 text-sm font-bold text-[#0A1931] transition-colors hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isGoogleLoading ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-[#0B56D9]" />
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.8 15.71 17.58V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                          <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.58C14.72 18.24 13.47 18.64 12 18.64C9.16 18.64 6.75 16.72 5.88 14.16H2.21V17.01C4.01 20.59 7.71 23 12 23Z" fill="#34A853" />
                          <path d="M5.88 14.16C5.66 13.5 5.53 12.77 5.53 12C5.53 11.23 5.66 10.5 5.88 9.84V6.99H2.21C1.47 8.46 1.04 10.18 1.04 12C1.04 13.82 1.47 15.54 2.21 17.01L5.88 14.16Z" fill="#FBBC05" />
                          <path d="M12 5.36C13.62 5.36 15.06 5.92 16.2 7.01L19.35 3.86C17.45 2.09 14.97 1 12 1C7.71 1 4.01 3.41 2.21 6.99L5.88 9.84C6.75 7.28 9.16 5.36 12 5.36Z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                      </>
                    )}
                  </button>

                  <p className="mt-5 text-[11px] leading-relaxed text-slate-400 text-center">
                    By continuing you agree to our Terms and Privacy Policy.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-extrabold tracking-tight text-[#0A1931] mt-2 text-center">
                    Hi{googleUser?.firstName ? `, ${googleUser.firstName}` : ''}!
                  </h2>
                  <p className="mt-2 mb-6 text-sm leading-relaxed text-slate-500 text-center px-2">
                    Just your mobile number and your Pick O Pick account is
                    ready. We only use it for order updates.
                  </p>

                  {welcomeEmailSent === true && (
                    <p className="mb-5 w-full rounded-xl bg-emerald-50 px-4 py-3 text-center text-xs leading-relaxed text-emerald-800">
                      Your Pick ID was sent to <strong>{googleUser?.emailID}</strong>.
                    </p>
                  )}
                  {welcomeEmailSent === false && (
                    <p className="mb-5 w-full rounded-xl bg-amber-50 px-4 py-3 text-center text-xs leading-relaxed text-amber-800">
                      We could not send your Pick ID email. Please contact sales@pickopick.com if it does not arrive.
                    </p>
                  )}

                  <form onSubmit={handleMobileSubmit} className="w-full flex flex-col gap-4">
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Phone size={18} />
                      </div>
                      <input
                        type="tel"
                        required
                        inputMode="tel"
                        value={phoneNumber}
                        onChange={(event) => setPhoneNumber(event.target.value)}
                        placeholder="Mobile number (e.g. +1 555 000 0000)"
                        autoFocus
                        className="w-full bg-white border border-slate-200 focus:border-[#0B56D9] focus:ring-[#0B56D9]/20 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-4 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingPhone}
                      className="w-full bg-[#0B56D9] hover:bg-[#0849B7] text-white py-3.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer group"
                    >
                      {isSavingPhone ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <>
                          Finish &amp; Continue
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
