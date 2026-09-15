import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, ArrowLeft} from "lucide-react";
import { FieldError } from "@/components/error/fieldError";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";

export const Route = createLazyFileRoute("/forgotPassword")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  // const [isLoading, setIsLoading] = useState(false);


  const { mutate: submitRequest, isPending, isSuccess, reset } = useForgotPassword();

  const validate = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // setIsLoading(true);
    submitRequest({ email });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-rubik px-4">
      <div className="w-full max-w-md">
        {!isSuccess ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-6">
              <Mail className="w-6 h-6 text-blue-500" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Forgot password?
            </h1>
            <p className="text-gray-500 text-sm mb-7 leading-relaxed">
              No worries — enter the email address linked to your account and
              we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Example@email.com"
                  autoComplete="email"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all
                    ${
                      error
                        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                    }`}
                />
                <FieldError message={error} />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gray-900 hover:bg-gray-700 active:scale-[0.98] text-white py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-center">
              <Link
                to="/login"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          </div>
        ) : (
          /* ── Success state ── */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-7 h-7 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Check your email
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-1">
              We sent a password reset link to
            </p>
            <p className="text-gray-800 font-semibold text-sm mb-6">{email}</p>

            <p className="text-xs text-gray-400 mb-6">
              Didn't receive it? Check your spam folder or{" "}
              <button
                onClick={() => reset()}
                className="text-blue-600 hover:underline font-medium"
              >
                try a different email
              </button>
              .
            </p>

            <div className="pt-5 border-t border-gray-100 flex justify-center">
              <Link
                to="/login"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
