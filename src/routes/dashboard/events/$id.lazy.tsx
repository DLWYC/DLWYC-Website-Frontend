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
import { MapPin, UserIcon, Check, X, Calendar } from "lucide-react";
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
    () => setQuantity((q) => Math.min(10, q + 1)),
    [],
  );

  const handlePayment = useCallback(() => {
    const activeRef = referenceRef.current;
    if (paymentPending || !activeRef || !user?.email) {
      console.log("resss", paymentPending, activeRef, user?.email);
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
    return <div>Loading event details...</div>;
  }

  if (fetchError || !event) {
    return <div>Failed to load event data.</div>;
  }

  if (trxref) {
    return (
      <div className="h-full flex items-center justify-center font-rubik">
        <div className="w-full max-w-[420px] rounded-2xl bg-white border border-gray-100 overflow-hidden">
          {verifying && (
            <div className="p-8 flex flex-col items-center gap-4 text-center">
              <Spinner />
              <div>
                <p className="text-[16px] font-[600]">
                  Confirming your payment
                </p>
                <p className="text-[13px] text-gray-500 mt-2 leading-relaxed">
                  Hang tight, this only takes a moment
                </p>
              </div>
            </div>
          )}

          {!verifying && status === "success" && (
            <div className="flex flex-col">
              <div className="p-8 flex flex-col items-center gap-3 text-center border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-700" />
                </div>
                <p className="text-[20px] font-[700] text-[#173404]">
                  Payment Successful
                </p>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  Your registration is confirmed. A receipt has been sent to
                  your email.
                </p>
              </div>

              {/* Order Summary */}
              <div className="p-5 border-b border-gray-100">
                <p className="text-[12px] font-[600] text-primary-main tracking-wide uppercase mb-3">
                  Order Summary
                </p>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-[13px] font-[500] truncate max-w-[220px]">
                    {event?.eventTitle}
                  </span>
                  <span className="text-[13px] font-[600]">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3">
                  <span className="text-[14px] font-[600] text-primary-main">
                    Total
                  </span>
                  <span className="text-[16px] font-[700] text-reddish">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <Link
                  to={"/dashboard"}
                  className="w-full h-12 flex items-center justify-center bg-primary-main text-white text-[14px] font-[600] rounded-[10px] hover:bg-primary-dark transition-colors"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          )}

          {!verifying && status === "failed" && (
            <div className="p-8 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <X className="w-5 h-5 text-red-700" />
              </div>
              <p className="text-[16px] font-[600] text-[#501313]">
                Couldn't confirm yet
              </p>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                If you were charged, it may still be processing. Check back
                shortly or contact support.
              </p>
              <Link
                to={"/dashboard"}
                className="w-full h-11 flex items-center justify-center mt-2 border border-gray-200 text-gray-700 text-[14px] font-[500] rounded-[10px] hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </Link>
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
          <RadioGroup
            value={registrationMode}
            onValueChange={setRegistrationMode}
            defaultValue="code"
            className="w-full lg:flex grid"
          >
            <FieldLabel
              htmlFor="code"
              onClick={() => setRegistrationMode("code")}
              className="relative bg-white rounded-xl p-4 has-data-[state=checked]:bg-primary-main text-primary-main has-data-[state=checked]:border-primary-main has-data-[state=checked]:text-white cursor-pointer"
            >
              <Field
                orientation="vertical"
                className="flex items-center justify-center space-y-3"
              >
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
                className="relative bg-white rounded-xl p-4 has-data-[state=checked]:bg-primary-main text-primary-main has-data-[state=checked]:border-primary-main has-data-[state=checked]:text-white cursor-pointer"
              >
                <Field
                  orientation="vertical"
                  className="flex items-center justify-center space-y-3"
                >
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
          <div className="w-full max-w-sm rounded-2xl bg-white py-10 px-6 gap-8 flex flex-col items-center justify-center">
            <div className="flex flex-col space-y-1">
              <h2 className="font-bold text-2xl font-header text-center tracking-tight">
                Verification Code
              </h2>
              <p className=" font-[400] text-muted-foreground text-center text-[14px] leading-snug">
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
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-10 *:data-[slot=input-otp-slot]:w-30 *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
              </InputOTPGroup>
            </InputOTP>

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
          <div className="w-full rounded-2xl bg-white border border-gray-100 p-5 flex flex-col gap-5 font-rubik">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-11 h-11 rounded-[10px] bg-reddish/10 flex-shrink-0 flex items-center place-content-center">
                {" "}
                <Calendar className="text-primary font-bold" />{" "}
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-[500] font-header truncate">
                  {event?.eventTitle}
                </p>
                <p className="text-[12px] text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {event?.eventLocation ?? "Venue"}
                </p>
              </div>
              <span className="ml-auto text-[16px] font-[600] text-primary whitespace-nowrap ">
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
          <div className="w-full max-w-[420px] mx-auto rounded-2xl bg-white border border-gray-100 overflow-hidden font-rubik">
            {/* Your Details */}
            <div className="p-5 border-b border-gray-100">
              <p className="text-[12px] font-[600] text-primary-main tracking-wide uppercase mb-3">
                Your Details
              </p>

              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-[13px] text-gray-500">Name</span>
                <span className="text-[13px] font-[600] text-right">
                  {user?.fullName}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-[13px] text-gray-500">Email</span>
                <span className="text-[13px] font-[600] text-right truncate max-w-[220px]">
                  {user?.email}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[13px] text-gray-500">
                  Number of people
                </span>
                <span className="text-[13px] font-[600]">{quantity}</span>
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-5 border-b border-gray-100">
              <p className="text-[12px] font-[600] text-primary-main tracking-wide uppercase mb-3">
                Order Summary
              </p>

              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-[13px] font-[500] truncate max-w-[220px]">
                  {event?.eventTitle}
                </span>
                <span className="text-[13px] font-[600]">
                  ₦{event.eventPrice}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-[14px] font-[600] text-primary-main">
                  Total
                </span>
                <span className="text-[16px] font-[700] text-reddish">
                  ₦{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Confirmation notice */}
            <div className="p-5">
              <button
                onClick={handlePayment}
                disabled={paymentPending || !referenceRef}
                className="w-full h-12 mt-4 rounded-[10px] bg-primary-main text-white text-[14px] font-[600] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                {paymentPending
                  ? "Redirecting..."
                  : `Pay ₦${total.toLocaleString()}`}
              </button>

              <p className="text-center text-[11px] text-gray-400 mt-3">
                Secured by Paystack
              </p>
            </div>
          </div>
        </TabsContent>

        {/* SUccessful */}
        <TabsContent value="successful">
          <div className="flex flex-col font-rubik bg-white rounded-[15px]">
            <div className="p-8 flex flex-col items-center gap-3 text-center border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-700" />
              </div>
              <p className="text-[20px] font-[700] text-[#173404]">
                Registration Successful
              </p>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                You have successfully registered for {event?.eventTitle}
              </p>
            </div>

            {/* Order Summary */}

            <div className="p-5">
              <Link
                to={"/dashboard"}
                className="w-full h-12 flex items-center justify-center bg-primary-main text-white text-[14px] font-[600] rounded-[10px] hover:bg-primary-dark transition-colors"
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
  );
}
