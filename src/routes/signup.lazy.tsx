import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Eye, EyeOff, User, Mail, Phone, Lock, Users, Calendar, Church, Image, ChevronLeft,
} from "lucide-react";
import Churches from "../data/churches";
import { FieldError } from "@/components/error/fieldError";
import { Testimonial } from "@/components/testimonial";
import Logo from "@/assets/main_logo.svg";
import SignupBackground from "@/assets/signupbg.png";
import { useRegister } from "@/features/auth/hooks/useSign";

export const Route = createLazyFileRoute("/signup")({
  component: SignUpView,
});

const INITIAL_FORM = {
  fullName: "",
  email: "",
  password: "",
  phoneNumber: "",
  gender: "Male",
  archdeaconry: "",
  parish: "",
  age: "",
  profilePicture: "",
  membershipType: "" as "Member" | "Guest" | "",
};

type Step = "role-select" | "form";

function InputWrapper({
  icon: Icon,
  error,
  children,
}: {
  icon: React.ElementType;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative flex items-center border rounded-lg transition-all
        ${
          error
            ? "border-red-400 bg-red-50 focus-within:ring-2 focus-within:ring-red-100"
            : "border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400"
        }`}
    >
      <Icon className="absolute left-3 w-[15px] h-[15px] text-gray-400 pointer-events-none shrink-0" />
      {children}
    </div>
  );
}

const inputCls =
  "w-full pl-9 pr-4 py-2.5 text-[13px] bg-transparent outline-none rounded-lg text-gray-800 placeholder:text-gray-400";
const selectCls =
  "w-full pl-9 pr-4 py-2.5 text-[13px] bg-transparent outline-none rounded-lg text-gray-800 appearance-none cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400";

// ── Role selection card ──
function RoleCard({
  type,
  description,
  selected,
  onSelect,
}: {
  type: "Member" | "Guest";
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200
        ${
          selected
            ? "border-primary-main bg-primary-main/5"
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-[14px] font-semibold ${selected ? "text-primary-main" : "text-gray-800"}`}>
            {type}
          </p>
          <p className="text-[12px] text-gray-400 mt-0.5">{description}</p>
        </div>
        {/* Custom radio circle */}
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
            ${selected ? "border-primary-main" : "border-gray-300"}`}
        >
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary-main" />}
        </div>
      </div>
    </button>
  );
}

function SignUpView() {
  const { mutate: register, isPending } = useRegister();

  const [step, setStep] = useState<Step>("role-select");
  const [animating, setAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"forward" | "back">("forward");

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isMember = formData.membershipType === "Member";

  const availableParishes = useMemo(() => {
    if (!formData.archdeaconry) return [];
    const selected = Churches.find((c) => c.archdeaconry === formData.archdeaconry);
    return selected ? selected.churches : [];
  }, [formData.archdeaconry]);

  // ── Slide transition helper ──
  const goTo = (nextStep: Step, direction: "forward" | "back") => {
    setSlideDirection(direction);
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 250);
  };

  const handleRoleSelect = (type: "Member" | "Guest") => {
    setFormData((prev) => ({
      ...prev,
      membershipType: type,
      archdeaconry: "",
      parish: "",
    }));
    setErrors({});
  };

  const handleProceed = () => {
    if (!formData.membershipType) return;
    goTo("form", "forward");
  };

  const handleBack = () => {
    goTo("role-select", "back");
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "archdeaconry" && { parish: "" }),
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, profilePicture: "Please select a valid image file" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, profilePicture: "Image size should not exceed 5MB" }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setFormData((prev) => ({ ...prev, profilePicture: result }));
      setErrors((prev) => ({ ...prev, profilePicture: "" }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!formData.fullName.trim()) next.fullName = "Full name is required";
    if (!formData.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      next.email = "Enter a valid email address";
    if (!formData.password) next.password = "Password is required";
    else if (formData.password.length < 8)
      next.password = "Password must be at least 8 characters";
    if (!formData.phoneNumber.trim()) next.phoneNumber = "Phone number is required";
    else if (!/^[0-9]{10,15}$/.test(formData.phoneNumber.replace(/[\s-]/g, "")))
      next.phoneNumber = "Enter a valid phone number";
    if (!formData.age) next.age = "Age is required";
    else if (isNaN(Number(formData.age)) || Number(formData.age) < 1 || Number(formData.age) > 120)
      next.age = "Enter a valid age";
    if (isMember) {
      if (!formData.archdeaconry) next.archdeaconry = "Please select an archdeaconry";
      if (!formData.parish) next.parish = "Please select a parish";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    register(formData, {
      onSuccess: () => {
        setFormData(INITIAL_FORM);
      },
    });
  };

  // ── Slide animation classes ──
  // const slideClass = animating
  //   ? slideDirection === "forward"
  //     ? "opacity-0 -translate-x-4"
  //     : "opacity-0 translate-x-4"
  //   : "opacity-100 translate-x-0";

  return (
    <div className="flex min-h-screen font-rubik">
      {/* ── Left: form panel ── */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[40%] px-5 sm:px-2 bg-white overflow-y-auto">
        <div className="max-w-lg w-full space-y-4">

          {/* Logo */}
          <div className="">
            <img src={Logo} alt="DLWYC Logo" className="h-10 w-auto" />
          </div>

            
              <div className="">
                {/* Header with back button */}

                <div className=" flex items-center font-rubik leading-[40px] text-[20px]">
                  <h2>Create An Account</h2>
                </div>

                {/* Full Name */}
                <div>
                  <label className="text-[14px] font-[400] text-gray-700 mb-[1.5px]">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <InputWrapper icon={User} error={errors.fullName}>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className={inputCls}
                    />
                  </InputWrapper>
                  <FieldError message={errors.fullName} />
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[14px] font-[400] text-gray-700 mb-[1.5px]">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <InputWrapper icon={Mail} error={errors.email}>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Example@email.com"
                        autoComplete="email"
                        className={inputCls}
                      />
                    </InputWrapper>
                    <FieldError message={errors.email} />
                  </div>

                  <div>
                    <label className="text-[14px] font-[400] text-gray-700 mb-[1.5px]">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <InputWrapper icon={Phone} error={errors.phoneNumber}>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        autoComplete="tel"
                        className={inputCls}
                      />
                    </InputWrapper>
                    <FieldError message={errors.phoneNumber} />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-[14px] font-[400] text-gray-700 mb-[1.5px]">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <InputWrapper icon={Lock} error={errors.password}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      className={`${inputCls} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </InputWrapper>
                  <FieldError message={errors.password} />
                </div>

                {/* Gender + Age */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[14px] font-[400] text-gray-700 mb-[1.5px]">
                      Gender <span className="text-red-400">*</span>
                    </label>
                    <InputWrapper icon={Users} error={errors.gender}>
                      <select name="gender" value={formData.gender} onChange={handleChange} className={selectCls}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </InputWrapper>
                  </div>

                  <div>
                    <label className="text-[14px] font-[400] text-gray-700 mb-[1.5px]">
                      Age <span className="text-red-400">*</span>
                    </label>
                    <InputWrapper icon={Calendar} error={errors.age}>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Enter your age"
                        min="1"
                        max="120"
                        className={inputCls}
                      />
                    </InputWrapper>
                    <FieldError message={errors.age} />
                  </div>
                </div>

                
                  <div className="grid grid-cols-2 gap-3  mb-4">
                    <div>
                      <label className="text-[14px] font-[400] text-gray-700 mb-[1.5px]">
                        Archdeaconry <span className="text-red-400">*</span>
                      </label>
                      <InputWrapper icon={Church} error={errors.archdeaconry}>
                        <select name="archdeaconry" value={formData.archdeaconry} onChange={handleChange} className={selectCls}>
                          <option value="">Select Archdeaconry</option>
                          {Churches.map((church) => (
                            <option key={church.id} value={church.archdeaconry}>
                              {church.archdeaconry}
                            </option>
                          ))}
                        </select>
                      </InputWrapper>
                      <FieldError message={errors.archdeaconry} />
                    </div>

                    <div>
                      <label className="text-[14px] font-[400] text-gray-700 mb-[1.5px]">
                        Parish <span className="text-red-400">*</span>
                      </label>
                      <InputWrapper icon={Church} error={errors.parish}>
                        <select
                          name="parish"
                          value={formData.parish}
                          onChange={handleChange}
                          disabled={!formData.archdeaconry}
                          className={selectCls}
                        >
                          <option value="">
                            {formData.archdeaconry ? "Select Parish" : "Select Archdeaconry First"}
                          </option>
                          {availableParishes.map((parish) => (
                            <option key={parish.id} value={parish.name}>
                              {parish.name}
                            </option>
                          ))}
                        </select>
                      </InputWrapper>
                      <FieldError message={errors.parish} />
                    </div>
                  </div>

                {/* Profile Picture
                <div>
                  <label className="text-[14px] font-[400] text-gray-700 mb-[1.5px]">
                    Profile Picture{" "}
                    <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                  </label>
                  <div className="flex items-center gap-4">
                    {formData.profilePicture ? (
                      <img
                        src={formData.profilePicture}
                        alt="Preview"
                        className="w-16 h-16 rounded-full object-cover border border-gray-200 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                        <Image className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <input type="file" id="profilePicture" accept="image/*" onChange={handleImageChange} className="hidden" />
                      <label
                        htmlFor="profilePicture"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        Choose Image
                      </label>
                      <p className="mt-1 text-xs text-gray-400">PNG, JPG up to 5MB</p>
                      <FieldError message={errors.profilePicture} />
                    </div>
                  </div>
                </div> */}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="w-full bg-primary-main hover:bg-reddish active:scale-[0.98] text-white py-2.5 rounded-lg text-[14px] font-[400] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <p className="text-sm text-center mt-2 text-gray-500">
                  Already have an account?{" "}
                  <Link to="/login" className="text-reddish font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
          </div>
        </div>

      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden">
        <img src={SignupBackground} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
        <Testimonial />
      </div>
    </div>
  );
}