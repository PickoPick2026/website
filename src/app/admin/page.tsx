import { useEffect } from "react";

export default function AdminRedirectPage() {
  useEffect(() => {
    // Immediately redirect to Pick O Pick Admin Portal on Vercel
    window.location.replace("https://pickadmin.vercel.app/");
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 text-white">
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0B56D9] border-t-transparent" />
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Redirecting to Admin Portal...
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Taking you to{" "}
            <span className="font-mono text-blue-400">
              pickadmin.vercel.app
            </span>
          </p>
        </div>
        <a
          href="https://pickadmin.vercel.app/"
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-400 underline hover:text-blue-300"
        >
          Click here if you are not redirected automatically &rarr;
        </a>
      </div>
    </div>
  );
}
