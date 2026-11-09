import { createLazyFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, KeyRound, Eye, EyeOff } from "lucide-react";
import { FieldError } from "@/components/error/fieldError";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";

export const Route = createLazyFileRoute("/resetPassword")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = useSearch({ strict: false }) as { token: string };

  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [errors, setErrors]                   = useState({ password: "", confirmPassword: "" });

  const { mutate: submitReset, isPending } = useResetPassword();

  const validate = () => {
    const next = { password: "", confirmPassword: "" };

    if (!password) {
      next.password = "Password is required";
    } else if (password.length < 8) {
      next.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      next.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      next.confirmPassword = "Passwords do not match";
    }

    setErrors(next);
    return !next.password && !next.confirmPassword;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    submitReset({ token, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-rubik px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Icon */}
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-6">
            <KeyRound className="w-6 h-6 text-blue-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Set new password
          </h1>
          <p className="text-gray-500 text-sm mb-7 leading-relaxed">
            Your new password must be at least 8 characters long.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                New password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-sm outline-none transition-all
                    ${errors.password
                      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldError message={errors.password} />
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-sm outline-none transition-all
                    ${errors.confirmPassword
                      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldError message={errors.confirmPassword} />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gray-900 hover:bg-gray-700 active:scale-[0.98] text-white py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Resetting…
                </>
              ) : (
                "Reset password"
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
      </div>
    </div>
  );
}