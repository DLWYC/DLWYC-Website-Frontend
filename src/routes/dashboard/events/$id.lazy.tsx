import { createLazyFileRoute, useSearch, Link } from "@tanstack/react-router";
import { useGetSingleEventData, usePaymentWebHook } from "@/features/dashboard/hooks/useFetchEvents";
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
import { MapPin, UserIcon, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  useVerifyCode,
  useInitalizePaymentTransaction,
} from "@/features/dashboard/hooks/useRegisterEvents";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import Spinner from "@/components/Loader/Spinner";

export const Route = createLazyFileRoute("/dashboard/events/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { trxref } = useSearch({ from: "/dashboard/events/$id" });

  // ── ALL HOOKS DECLARED UNCONDITIONALLY, TOP OF COMPONENT ──
  // No hook below this block may sit inside an if/loop/early-return.
  const {
    data: event,
    isLoading,
    error: fetchError,
  } = useGetSingleEventData(id);

  const {
    mutate: initializePayment,
    isPending: paymentPending,
    error: paymentError,
  } = useInitalizePaymentTransaction();

  const [tabState, setTabState] = useState("mode");
  const [code, setCode] = useState("");
  const [registrationMode, setRegistrationMode] = useState("code");
  const [quantity, setQuantity] = useState(1);

  const { mutate: verifyCode, isPending: verifyPending, error: verifyError } =
    useVerifyCode(id, code);

  const { data: user } = useAuthUser();

  // Reference generated exactly ONCE (as soon as user.uniqueID is available),
  // then locked — re-renders never regenerate it, so what the user sees
  // always matches what gets sent to Paystack.
  const referenceRef = useRef<string | null>(null);
  if (!referenceRef.current && user?.uniqueID) {
    referenceRef.current = `TXN_${user.uniqueID.replace(/[^a-zA-Z0-9]/g, "")}_${Date.now()}`;
  }
  const reference = referenceRef.current;

  // Poll/verify webhook status only when trxref exists — the hook itself
  // should internally no-op if trxref is undefined, but it's still ALWAYS
  // called so hook order never shifts.
  const { data: status, isLoading: verifying } = usePaymentWebHook(trxref ?? "");


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
    () => setQuantity((q) => Math.min(10, q + 1)),
    [],
  );

  // handlePayment left untouched per your API's contract — amount/amountOfPeople
  // are exactly as your backend expects them.
  const handlePayment = useCallback(() => {
    if (paymentPending || !reference) return; // guards the double-click race
    initializePayment({
      email: user?.email,
      amount: total,
      reference,
      eventId: id,
      amountOfPeople: quantity,
    });
  }, [paymentPending, reference, initializePayment, user?.email, unitPrice, id, quantity]);

  const handleNext = useCallback(() => {
    switch (tabState) {
      case "mode":
        setTabState(registrationMode === "code" ? "verify-code" : "paymentDetails");
        break;
      case "paymentDetails":
        setTabState("payment");
        break;
      // "verify-code" and "payment" advance on their own success callbacks,
      // not via this generic Next button.
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
    verifyCode(undefined, {
      onSuccess: () => setTabState("successful"),
    });
  }, [verifyCode]);

  // ── EARLY RETURNS — ONLY NOW, AFTER EVERY HOOK HAS RUN ──
  if (isLoading) {
    return <div>Loading event details...</div>;
  }

  if (fetchError || !event) {
    return <div>Failed to load event data.</div>;
  }

  if (trxref) {
    return (
      <div className="h-full flex items-center justify-center font-rubik">
        <div className="w-full max-w-[450px] h-[250px] rounded-[20px] bg-white border border-gray-100 overflow-hidden ">
          {verifying && (
            <div className="h-full pt-9 pb-7 px-6 flex flex-col items-center gap-4 text-center">
              <Spinner />
              <div>
                <p className="text-[16px] font-[500]">Confirming your payment</p>
                <p className="text-[13px] text-gray-500 mt-2 leading-relaxed">
                  Hang tight, this only takes a moment
                </p>
              </div>
            </div>
          )}

          {!verifying && status === "success" && (
            <div className="bg-green-50 h-full flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <p className="text-[25px] font-[500] text-[#173404]">Payment Successful</p>
                <p className="text-[14px] text-[#3B6D11] mt-1.5 leading-relaxed mb-4">
                  Click the button below to return to the dashboard and view your registered events
                </p>
                <Link to={'/dashboard'} className=" bg-primary-main text-white py-2 px-4 text-[14px] rounded-md hover:bg-primary-dark">
                  Return to Dashboard
                </Link>
              </div>
            </div>
          )}

          {!verifying && status === "failed" && (
            <div className="bg-red-50 pt-9 pb-6 px-6 flex flex-col items-center gap-3.5 text-center">
              <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center">
                <X className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <p className="text-[16px] font-[500] text-[#501313]">
                  Couldn't confirm yet
                </p>
                <p className="text-[13px] text-[#A32D2D] mt-1.5 leading-relaxed">
                  If you were charged, it may still be processing
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[80vh] w-full flex flex-col py-[50px] lg:px-[40px] px-[10px] justify-center items-center">
      <Tabs
        value={tabState}
        onValueChange={setTabState}
        className="lg:w-[85%] w-full space-y-4"
      >
        {/* Mode selection */}
        <TabsContent value="mode">
          <h2 className="text-center font-header font-bold text-[25px] py-3">
            Select Mode
          </h2>
          <RadioGroup defaultValue="code" className="w-full lg:flex grid">
            <FieldLabel
              htmlFor="code"
              onClick={() => setRegistrationMode("code")}
              className="relative bg-white rounded-xl p-4 has-data-[state=checked]:bg-primary-main text-primary-main has-data-[state=checked]:border-primary-main has-data-[state=checked]:text-white cursor-pointer"
            >
              <Field orientation="vertical" className="flex items-center justify-center space-y-3">
                <div className="rounded-md has-data-[state=checked]:bg-white has-data-[state=checked]:text-[white]">
                  <UserIcon />
                </div>
                <FieldContent>
                  <FieldTitle className="font-header text-[22px] font-bold">
                    Enter Code
                  </FieldTitle>
                  <FieldDescription className="font-rubik text-[14px] has-data-[state=checked]:text-white/70">
                    Enter your code to register
                  </FieldDescription>
                </FieldContent>
              </Field>
              <RadioGroupItem value="code" id="code" className="absolute right-4 top-4" />
            </FieldLabel>

            <FieldLabel
              htmlFor="payment"
              onClick={() => setRegistrationMode("payment")}
              className="relative bg-white rounded-xl p-4 has-data-[state=checked]:bg-primary-main text-primary-main has-data-[state=checked]:border-primary-main has-data-[state=checked]:text-white cursor-pointer"
            >
              <Field orientation="vertical" className="flex items-center justify-center space-y-3">
                <div className="rounded-md has-data-[state=checked]:bg-white has-data-[state=checked]:text-[white]">
                  <UserIcon />
                </div>
                <FieldContent>
                  <FieldTitle className="font-header text-[22px] font-bold">
                    Make Payment
                  </FieldTitle>
                  <FieldDescription className="font-rubik text-[14px] has-data-[state=checked]:text-white/70">
                    You are paying for yourself alone
                  </FieldDescription>
                </FieldContent>
              </Field>
              <RadioGroupItem value="payment" id="payment" className="absolute right-4 top-4" />
            </FieldLabel>
          </RadioGroup>
        </TabsContent>

        {/* OTP verification */}
        <TabsContent value="verify-code" className="flex justify-center">
          <div className="w-full max-w-sm rounded-2xl bg-white py-10 px-6 gap-8 flex flex-col items-center justify-center">
            <div className="flex flex-col space-y-1">
              <h2 className="font-bold text-2xl font-header text-center tracking-tight">
                Verification Code
              </h2>
              <p className=" font-[400] text-muted-foreground text-center text-[14px] leading-snug">
                Enter the code you received <br /> from your representative
              </p>
            </div>

            <InputOTP maxLength={5} id="otp-verification" required value={code} onChange={setCode}>
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-10 *:data-[slot=input-otp-slot]:w-30 *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
              </InputOTPGroup>
            </InputOTP>

            {verifyError && (
              <p className="text-[13px] text-red-500  -mt-4">
                {verifyError.message}
              </p>
            )}

            <Button
              className="w-full rounded-lg font-rubik font-normal text-sm py-5 text-white bg-primary-main hover:bg-primary-main/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              onClick={handleVerifyCode}
              disabled={verifyPending || code.length < 5}
            >
              {verifyPending ? "Verifying..." : "Verify Code"}
            </Button>
          </div>
        </TabsContent>

        {/* Payment details / headcount */}
        <TabsContent value="paymentDetails">
          <div className="w-full rounded-2xl bg-white border border-gray-100 p-5 flex flex-col gap-5">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-11 h-11 rounded-[10px] bg-reddish/10 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[15px] font-[500] font-header truncate">
                  {event?.eventTitle}
                </p>
                <p className="text-[12px] text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {event?.location ?? "Venue"}
                </p>
              </div>
              <span className="ml-auto text-[15px] font-[500] text-reddish whitespace-nowrap ">
                ₦{unitPrice.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[14px] font-[500] ">How many people?</span>
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={decrement}
                  disabled={quantity <= 1}
                  className="w-7 h-7 rounded-full border border-gray-300 text-[15px] flex items-center justify-center disabled:opacity-40 active:scale-95 transition-transform"
                >
                  −
                </button>
                <span className="text-[15px] font-[500] min-w-[14px] text-center ">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={increment}
                  className="w-7 h-7 rounded-full bg-reddish text-white text-[15px] flex items-center justify-center active:scale-95 transition-transform"
                >
                  +
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3.5 flex items-center justify-between">
              <span className="text-[13px] text-gray-500 ">
                Total for {quantity} {quantity === 1 ? "person" : "people"}
              </span>
              <span className="text-[17px] font-[500] text-reddish ">
                ₦{total.toLocaleString()}
              </span>
            </div>
          </div>
        </TabsContent>

        {/* Payment summary + pay */}
        <TabsContent value="payment">
          <div className="w-full max-w-[420px] mx-auto rounded-2xl bg-white border border-gray-100 p-5 flex flex-col gap-4">
            <p className="text-[15px] font-[500] font-header">Complete payment</p>

            <div>
              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <span className="text-[13px] text-gray-500 ">Name</span>
                <span className="text-[13px] font-[500] ">{user?.fullName}</span>
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <span className="text-[13px] text-gray-500 ">Number of people</span>
                <span className="text-[13px] font-[500] ">{quantity}</span>
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <span className="text-[13px] text-gray-500 ">Reference</span>
                <span className="text-[12px] font-[500] font-mono">
                  {reference ?? "Generating..."}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3.5 pb-1">
                <span className="text-[13px] text-gray-500 ">Amount</span>
                <span className="text-[18px] font-[500] text-reddish ">
                  ₦{total.toLocaleString()}
                </span>
              </div>
            </div>

            {paymentError && (
              <p className="text-[13px] text-red-500 ">
                {paymentError.message ?? "Something went wrong. Please try again."}
              </p>
            )}

            <button
              onClick={handlePayment}
              disabled={paymentPending || !reference}
              className="w-full h-11 rounded-[10px] bg-reddish text-white text-[14px] font-[500]  disabled:opacity-60"
            >
              {paymentPending ? "Redirecting..." : `Pay ₦${total.toLocaleString()}`}
            </button>

            <p className="text-center text-[12px] text-gray-400 ">
              Secured by Paystack
            </p>
          </div>
        </TabsContent>

        <div className="flex justify-between py-4">
          <Button
            type="button"
            className="w-[30%] font-rubik text-[14px] py-3 text-white bg-reddish disabled:bg-reddish/50 disabled:cursor-not-allowed cursor-pointer"
            disabled={tabState === "mode"}
            onClick={handleBack}
          >
            Back
          </Button>

          <Button
            type="button"
            className="w-[30%] font-rubik text-[14px] py-3 text-white bg-primary-main disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            disabled={tabState === "successful" || tabState === "verify-code" || tabState === "payment"}
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </Tabs>
    </div>
  );
}