import { createLazyFileRoute, useSearch, Link } from "@tanstack/react-router";

import {
  useGetSingleEventData,
  usePaymentWebHook,
} from "@/features/dashboard/hooks/useFetchEvents";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  MapPin,
  UserIcon,
  Check,
  X,
  Calendar,
  CreditCard,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useVerifyCode,
  useInitalizePaymentTransaction,
} from "@/features/dashboard/hooks/useRegisterEvents";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import Spinner from "@/components/Loader/Spinner";
import { customAlphabet } from "nanoid";

const generateReference = customAlphabet(
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
  12,
);

export const Route = createLazyFileRoute("/dashboard/events/$id")({
  component: RouteComponent,
});

/* -------------------------------------------------------------------------- */
/*  UI-only helpers (no logic, no API)                                        */
/* -------------------------------------------------------------------------- */

const cardBase =
  "w-full rounded-2xl border border-gray-100 bg-white font-rubik";
const sectionLabel =
  "mb-3 text-[12px] font-[600] tracking-wide text-primary uppercase";

function SummaryRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-50 py-2.5 last:border-0">
      <span className="text-[13px] text-gray-500">{label}</span>
      <span
        className={`max-w-[230px] truncate text-right text-[13px] ${
          strong ? "font-[700] text-reddish" : "font-[600]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function StatusScreen({
  tone,
  title,
  text,
  children,
}: {
  tone: "success" | "error";
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  const ok = tone === "success";
  return (
    <div className="flex flex-col items-center gap-3 border-b border-gray-100 p-8 text-center">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full ${
          ok ? "bg-green-100" : "bg-red-100"
        }`}
      >
        {ok ? (
          <Check className="h-6 w-6 text-green-700" />
        ) : (
          <X className="h-6 w-6 text-red-700" />
        )}
      </div>
      <p
        className={`font-header text-[20px] font-[700] ${
          ok ? "text-[#173404]" : "text-[#501313]"
        }`}
      >
        {title}
      </p>
      <p className="max-w-[300px] text-[13px] leading-relaxed text-gray-500">
        {text}
      </p>
      {children}
    </div>
  );
}

/** Progress header. Purely derived from existing state. */
function Steps({ tabState, mode }: { tabState: string; mode: string }) {
  const steps =
    mode === "code"
      ? [
          ["mode", "Method"],
          ["verify-code", "Code"],
          ["successful", "Done"],
        ]
      : [
          ["mode", "Method"],
          ["paymentDetails", "Details"],
          ["payment", "Pay"],
        ];
  const current = Math.max(
    0,
    steps.findIndex(([key]) => key === tabState),
  );
  return (
    <ol
      className="mx-auto flex w-full max-w-[420px] items-center font-header"
      aria-label="Progress"
    >
      {steps.map(([key, label], i) => (
        <li
          key={key}
          aria-current={i === current ? "step" : undefined}
          className="flex flex-1 items-center last:flex-none"
        >
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[14px] font-[600] transition-colors ${
              i < current
                ? "bg-primary-main text-white"
                : i === current
                  ? "border-2 border-primary-main bg-white text-primary"
                  : "border border-gray-200 bg-white text-gray-400"
            }`}
          >
            {i < current ? <Check className="h-3.5 w-3.5" /> : i + 1}
          </span>
          <span
            className={`ml-2 text-[12px] ${
              i === current ? "font-[600] text-primary" : "text-gray-400"
            }`}
          >
            {label}
          </span>
          {i < steps.length - 1 && (
            <span
              className={`mx-3 h-px flex-1 ${
                i < current ? "bg-primary-main" : "bg-gray-200"
              }`}
            />
          )}
        </li>
      ))}
    </ol>
  );
}

function RouteComponent() {
  const { id } = Route.useParams();
  const { trxref = "" } = useSearch({ from: "/dashboard/events/$id" });

  const {
    data: event,
    isLoading,
    error: fetchError,
  } = useGetSingleEventData(id);
  const { mutate: verifyCode, isPending: verifyPending } = useVerifyCode();
  const { mutate: initializePayment, isPending: paymentPending } =
    useInitalizePaymentTransaction();
  const { data: status, isLoading: verifying } = usePaymentWebHook(trxref);
  const { data: user } = useAuthUser();

  const [tabState, setTabState] = useState("mode");
  const [code, setCode] = useState("");
  const [registrationMode, setRegistrationMode] = useState("code");
  const [quantity, setQuantity] = useState(1);
  const referenceRef = useRef<string | null>(null);

  useEffect(() => {
    if (!referenceRef.current) {
      referenceRef.current = `TXN_${generateReference()}`;
    }
  }, []);

  // ── DERIVED VALUES, MEMOIZED ──
  const unitPrice = useMemo(
    () => parseFloat(event?.eventPrice) || 0,
    [event?.eventPrice],
  );
  const total = useMemo(() => unitPrice * quantity, [unitPrice, quantity]);

  const decrement = useCallback(
    () => setQuantity((q) => Math.max(1, q - 1)),
    [],
  );
  const increment = useCallback(
    () => setQuantity((q) => Math.min(20, q + 1)),
    [],
  );

  const handlePayment = useCallback(() => {
    const activeRef = referenceRef.current;
    if (paymentPending || !activeRef || !user?.email) {
      return;
    } // guards the double-click race

    initializePayment({
      email: user?.email,
      amount: total,
      reference: activeRef,
      eventId: id,
      amountOfPeople: quantity,
    });
  }, [paymentPending, initializePayment, user?.email, total, id, quantity]);

  const handleNext = useCallback(() => {
    switch (tabState) {
      case "mode":
        setTabState(
          registrationMode === "code" ? "verify-code" : "paymentDetails",
        );
        break;
      case "paymentDetails":
        setTabState("payment");
        break;
    }
  }, [tabState, registrationMode]);

  const handleBack = useCallback(() => {
    switch (tabState) {
      case "verify-code":
      case "paymentDetails":
        setTabState("mode");
        break;
      case "payment":
        setTabState("paymentDetails");
        break;
    }
  }, [tabState]);

  const handleVerifyCode = useCallback(() => {
    verifyCode(
      { eventId: id, code: code },
      {
        onSuccess: () => setTabState("successful"),
      },
    );
  }, [verifyCode, id, code, setTabState]);

  // ── EARLY RETURNS — ONLY NOW, AFTER EVERY HOOK HAS RUN ──
  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 font-rubik">
        <Spinner />
        <p className="text-[14px] text-gray-500">Loading event details...</p>
      </div>
    );
  }

  if (fetchError || !event) {
    return (
      <div className="flex h-[60vh] items-center justify-center px-4 font-rubik">
        <div
          role="alert"
          className={`${cardBase} max-w-[380px] p-8 text-center`}
        >
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <X className="h-5 w-5 text-red-700" />
          </div>
          <p className="text-[15px] font-[600] text-[#501313]">
            Failed to load event data.
          </p>
        </div>
      </div>
    );
  }

  if (trxref) {
    return (
      <div className="flex h-full items-center justify-center px-4 py-10 font-rubik">
        <div className="w-full max-w-[420px] overflow-hidden rounded-2xl border border-gray-100 bg-white">
          {verifying && (
            <div className="flex flex-col items-center gap-4 p-10 text-center">
              <Spinner />
              <div>
                <p className="font-header text-[16px] font-[600]">
                  Confirming your payment
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
                  Hang tight, this only takes a moment
                </p>
              </div>
            </div>
          )}

          {!verifying && status === "success" && (
            <div className="flex flex-col">
              <StatusScreen
                tone="success"
                title="Payment Successful"
                text="Your registration is confirmed. A receipt has been sent to your email."
              />

              <div className="p-5">
                <Link
                  to={"/dashboard"}
                  className="flex h-12 w-full items-center justify-center rounded-[10px] bg-primary-main text-[14px] font-[600] text-white transition-colors hover:bg-primary-dark"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          )}

          {!verifying && status === "failed" && (
            <StatusScreen
              tone="error"
              title="Couldn't confirm yet"
              text="If you were charged, it may still be processing. Check back shortly or contact support."
            >
              <Link
                to={"/dashboard"}
                className="mt-2 flex h-11 w-full items-center justify-center rounded-[10px] border border-gray-200 text-[14px] font-[500] text-gray-700 transition-colors hover:bg-gray-50"
              >
                Back to Dashboard
              </Link>
            </StatusScreen>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-6 px-[10px] py-8 lg:px-[40px]">
      <div className="w-full max-w-[940px] space-y-6">
        {/* Event header */}

        {tabState !== "successful" && (
          <Steps tabState={tabState} mode={registrationMode} />
        )}

        <Tabs
          value={tabState}
          onValueChange={setTabState}
          className="w-full space-y-4"
        >
          {/* Mode selection */}
          <TabsContent value="mode">
            <h2 className="py-3 text-center font-header text-[25px] font-bold">
              Select Mode
            </h2>
            <RadioGroup
              value={registrationMode}
              onValueChange={setRegistrationMode}
              defaultValue="code"
              className="grid w-full gap-3 sm:grid-cols-2"
            >
              <FieldLabel
                htmlFor="code"
                onClick={() => setRegistrationMode("code")}
                className="relative cursor-pointer rounded-xl border bg-white p-5 text-primary transition-colors hover:border-primary-main/40 has-data-[state=checked]:border-primary-main has-data-[state=checked]:bg-primary-main has-data-[state=checked]:text-white"
              >
                <Field
                  orientation="vertical"
                  className="flex items-center justify-center space-y-3"
                >
                  <div className="rounded-full bg-primary-main/10 p-3">
                    <KeyRound className="h-6 w-6" />
                  </div>
                  <FieldContent>
                    <FieldTitle className="font-header text-[20px] font-bold">
                      Enter Code
                    </FieldTitle>
                    <FieldDescription className="font-rubik text-[14px] has-data-[state=checked]:text-white/70">
                      Enter your code to register
                    </FieldDescription>
                  </FieldContent>
                </Field>
                <RadioGroupItem
                  value="code"
                  id="code"
                  className="absolute right-4 top-4"
                />
              </FieldLabel>

              {event?.registeredCount !== event?.eventCapacity && (
                <FieldLabel
                  htmlFor="payment"
                  onClick={() => setRegistrationMode("payment")}
                  className="relative cursor-pointer rounded-xl border bg-white p-5 text-primary transition-colors hover:border-primary-main/40 has-data-[state=checked]:border-primary-main has-data-[state=checked]:bg-primary-main has-data-[state=checked]:text-white"
                >
                  <Field
                    orientation="vertical"
                    className="flex items-center justify-center space-y-3"
                  >
                    <div className="rounded-full bg-primary-main/10 p-3">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <FieldContent>
                      <FieldTitle className="font-header text-[20px] font-bold">
                        Make Payment
                      </FieldTitle>
                      <FieldDescription className="font-rubik text-[14px] has-data-[state=checked]:text-white/70">
                        You are paying for yourself alone
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                  <RadioGroupItem
                    value="payment"
                    id="payment"
                    className="absolute right-4 top-4"
                  />
                </FieldLabel>
              )}
            </RadioGroup>
          </TabsContent>

          {/* OTP verification */}
          <TabsContent value="verify-code" className="flex justify-center">
            <div
              className={`${cardBase} flex max-w-sm flex-col items-center gap-8 px-6 py-10`}
            >
              <div className="flex flex-col space-y-1">
                <h2 className="text-center font-header text-2xl font-bold tracking-tight">
                  Verification Code
                </h2>
                <p className="text-center text-[14px] font-[400] leading-snug text-muted-foreground">
                  Enter the code you received <br /> from your representative
                </p>
              </div>

              <InputOTP
                maxLength={5}
                id="otp-verification"
                required
                value={code}
                onChange={setCode}
              >
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                </InputOTPGroup>
              </InputOTP>

              <Button
                className="w-full cursor-pointer rounded-lg bg-primary-main py-5 font-rubik text-sm font-normal text-white transition-colors hover:bg-primary-main/90 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleVerifyCode}
                disabled={verifyPending || code.length < 5}
              >
                {verifyPending ? "Verifying..." : "Verify Code"}
              </Button>
            </div>
          </TabsContent>

          {/* Payment details / headcount */}
          <TabsContent value="paymentDetails">
            <div className={`${cardBase} flex flex-col gap-5 p-5`}>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div>
                  <span className="text-[14px] font-[500]">
                    How many people?
                  </span>
                  <p className="text-[12px] text-gray-500">
                    Up to 20 per booking
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={decrement}
                    disabled={quantity <= 1}
                    aria-label="Decrease"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-[17px] transition-transform active:scale-95 disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="min-w-[18px] text-center text-[17px] font-[600]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={increment}
                    aria-label="Increase"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-reddish text-[17px] text-white transition-transform active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-[13px] text-gray-500">
                  Total for {quantity} {quantity === 1 ? "person" : "people"}
                </span>
                <span className="text-[20px] font-[600] text-reddish">
                  ₦{total.toLocaleString()}
                </span>
              </div>
            </div>
          </TabsContent>

          {/* Payment summary + pay */}
          <TabsContent value="payment">
            <div
              className={`${cardBase} mx-auto max-w-[420px] overflow-hidden`}
            >
              {/* Your Details */}
              <div className="border-b border-gray-100 p-5">
                <p className={sectionLabel}>Your Details</p>
                <SummaryRow label="Name" value={user?.fullName} />
                <SummaryRow label="Email" value={user?.email} />
                <SummaryRow label="Number of people" value={quantity} />
              </div>

              {/* Order Summary */}
              <div className="border-b border-gray-100 p-5">
                <p className={sectionLabel}>Order Summary</p>
                <SummaryRow
                  label={event?.eventTitle}
                  value={`₦${event.eventPrice}`}
                />
                <div className="mt-1 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <span className="text-[14px] font-[600] text-primary">
                    Total
                  </span>
                  <span className="text-[17px] font-[700] text-reddish">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Confirmation notice */}
              <div className="p-5">
                <button
                  onClick={handlePayment}
                  disabled={paymentPending || !referenceRef}
                  className="h-12 w-full cursor-pointer rounded-[10px] bg-primary-main text-[14px] font-[600] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {paymentPending
                    ? "Redirecting..."
                    : `Pay ₦${total.toLocaleString()}`}
                </button>

                <p className="mt-3 text-center text-[11px] text-gray-400">
                  Secured by Paystack
                </p>
              </div>
            </div>
          </TabsContent>

          {/* SUccessful */}
          <TabsContent value="successful">
            <div
              className={`${cardBase} mx-auto max-w-[420px] overflow-hidden`}
            >
              <StatusScreen
                tone="success"
                title="Registration Successful"
                text={`You have successfully registered for ${event?.eventTitle}`}
              />
              <div className="p-5">
                <Link
                  to={"/dashboard"}
                  className="flex h-12 w-full items-center justify-center rounded-[10px] bg-primary-main text-[14px] font-[600] text-white transition-colors hover:bg-primary-dark"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          </TabsContent>
          {/* SUccessful */}

          {tabState === "successful" ? (
            ""
          ) : (
            <div className="flex justify-between gap-3 py-2">
              <Button
                type="button"
                className="w-[40%] cursor-pointer bg-reddish py-3 font-rubik text-[14px] text-white disabled:cursor-not-allowed disabled:bg-reddish/50 sm:w-[30%]"
                disabled={tabState === "mode"}
                onClick={handleBack}
              >
                Back
              </Button>

              <Button
                type="button"
                className="w-[40%] cursor-pointer bg-primary-main py-3 font-rubik text-[14px] text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-[30%]"
                disabled={
                  tabState === "successful" ||
                  tabState === "verify-code" ||
                  tabState === "payment"
                }
                onClick={handleNext}
              >
                Next
              </Button>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}
