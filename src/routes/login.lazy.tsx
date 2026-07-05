import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { FieldError } from "@/components/error/fieldError";
import Logo from "@/assets/main_logo.svg";
import LoginBackground from "@/assets/LoginBackground.png";
import { Eye, EyeOff } from "lucide-react";
import { Testimonial } from "@/components/testimonial";

export const Route = createLazyFileRoute("/login")({
  component: LoginView,
});

function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  // 🧠 Grab our action runner from our feature hook
  const { mutate: login, isPending } = useLogin();

  const validate = () => {
    const next = { email: "", password: "" };
    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address";
    }
    if (!password) next.password = "Password is required";
    setErrors(next);
    return !next.email && !next.password;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    login({ email, password });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="flex min-h-screen h-[89vh] font-rubik">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[40%] px-5 sm:px-12 py-12 bg-white">
        <div className="max-w-sm w-full mx-auto">
          <div className="mb-5">
            <img src={Logo} alt="DLWYC Logo" className="h-10 w-auto" />
          </div>

          <h1 className="text-[25px] font-bold text-primary-main pt-1 pb-1 mb-1 text-center">
            Welcome Back 👋
          </h1>

          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-[1.5px]">
                Email
              </label>
              <input
                type="email"
                placeholder="Example@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                }}
                onKeyDown={handleKeyDown}
                autoComplete="email"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all
                  ${
                    errors.email
                      ? "border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50"
                      : "border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  }`}
              />
              <FieldError message={errors.email} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-[1.5px]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((p) => ({ ...p, password: "" }));
                  }}
                  onKeyDown={handleKeyDown}
                  autoComplete="current-password"
                  className={`w-full px-4 py-2.5 pr-11 border rounded-lg text-sm outline-none transition-all
                                ${
                                  errors.password
                                    ? "border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50"
                                    : "border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <FieldError message={errors.password} />
              <div className="text-right mt-1.5">
                <Link
                  to="/forgotPassword"
                  className="text-xs text-red-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full bg-primary-main hover:bg-reddish active:scale-[0.98] text-white py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">Or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google SSO */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2.5 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all duration-150 cursor-pointer"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
              Sign in with Google
            </button>
          </div>

          <p className="text-sm text-center mt-5 text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-reddish font-medium hover:underline">
              Sign up
            </Link>
          </p>

          <p className="text-center text-xs text-gray-300 mt-10">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>

      {/* ── Right: image + testimonial ── */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden">
        {/* Replace src with your own background image path */}
        <img
          src={LoginBackground}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
        <Testimonial />
      </div>
    </div>

    //
  );
}
