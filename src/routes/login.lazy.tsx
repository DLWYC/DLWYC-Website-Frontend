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
