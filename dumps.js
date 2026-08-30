import { createLazyFileRoute, useSearch } from "@tanstack/react-router";
import { useGetSingleEventData } from "@/features/dashboard/hooks/useFetchEvents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { MapPin, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  useVerifyCode,
  useInitalizePaymentTransaction,
  usePaymentWebHook,
} from "@/features/dashboard/hooks/useRegisterEvents";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import Spinner from "@/components/Loader/Spinner";


export const Route = createLazyFileRoute("/dashboard/events/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  // interface Event {
  //   _id: string;
  //   eventId: string;
  //   eventTitle: string;
  //   eventDate: string;
  //   eventDescription: string;
  //   eventImage?: string;
  //   eventPrice: string
  // }

  const { id } = Route.useParams();
  const { trxref } = useSearch({ from: "/dashboard/events/$id" });

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
  const { mutate: verifyCode, isPending, error } = useVerifyCode(id, code);
  const [registrationMode, setRegistrationMode] = useState("code");
  const [quantity, setQuantity] = useState(1);

  const unitPrice = parseFloat(event?.eventPrice) || 0;
  const total = unitPrice * quantity;
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) => Math.min(10, q + 1));
  const { data: user } = useAuthUser();
  const reference = `TXN_${user?.uniqueID?.replace(/[^a-zA-Z0-9]/g, "")}_${Date.now()}`;

  const handlePayment = () => {
    initializePayment({
      email: user?.email,
      amount: unitPrice,
      reference,
      eventId: id,
      amountOfPeople: quantity,
    });
  };
  // // const paymentReference = `TXN_${userDetails?.uniqueId?.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now()}`
  if (isLoading) {
    return <div>Loading event details...</div>;
  }

  if (fetchError || !event) {
    return <div>Failed to load event data.</div>;
  }

  if (trxref) {
    usePaymentWebHook()
    return (
      <div className="border border-red-500 h-full flex items-center place-content-center">
        <div className="border border-green-500 w-[40%] h-[35vh] bg-white flex items-center justify-center flex-col text-center gap-2 rounded-[15px] font-rubik">
            <Spinner />
          <div>
            <p className="text-[25px] font-[500] ">Verifying payment</p>
            <p className="text-[16px] text-gray-500 font-[300] mt-[1px]">
              This usually takes a few seconds
            </p>
          </div>
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
        {/* First Tab */}
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
              <Field
                orientation="vertical"
                className="flex items-center justify-center space-y-3"
              >
                <div className="rounded-md  has-data-[state=checked]:bg-white has-data-[state=checked]:text-[white]">
                  <UserIcon className="" />
                </div>
                <FieldContent>
                  <FieldTitle className="font-header text-[22px] font-bold">
                    Enter Code
                  </FieldTitle>
                  <FieldDescription className=" font-rubik text-[14px] has-data-[state=checked]:text-white/70">
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
                  <UserIcon className="" />
                </div>
                <FieldContent>
                  <FieldTitle className="font-header text-[22px] font-bold">
                    Make Payment
                  </FieldTitle>
                  <FieldDescription className=" font-rubik text-[14px] has-data-[state=checked]:text-white/70">
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
          </RadioGroup>
        </TabsContent>
        {/* First Tab */}

        {/* Second Tab */}
        <TabsContent value="verify-code" className="flex justify-center">
          <div className="w-full max-w-sm rounded-2xl bg-card/50 bg-white backdrop-blur-sm py-10 px-6 gap-8 flex flex-col items-center justify-center">
            <div className="flex flex-col space-y-1">
              <h2 className="font-bold text-2xl font-header text-center tracking-tight">
                Verification Code
              </h2>
              <p className="font-inter font-[400] text-muted-foreground text-center text-[14px] leading-snug">
                Enter the code you received <br /> from your representative
              </p>
            </div>

            <InputOTP
              maxLength={5}
              id="otp-verification"
              required
              value={code}
              onChange={(value) => setCode(value)}
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
              className={`w-full rounded-lg font-rubik font-normal text-sm py-5 text-white bg-primary-main hover:bg-primary-main/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
              onClick={() => verifyCode()}
              disabled={isPending ? true : false}
            >
              Verify Code
            </Button>
          </div>
        </TabsContent>
        {/* Second Tab */}

        {/* Payment Details */}
        <TabsContent value="paymentDetails">
          <div className="w-full rounded-2xl bg-white border border-gray-100 p-5 flex flex-col gap-5">
            {/* Header row: icon, title, location, price */}
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
              <span className="ml-auto text-[15px] font-[500] text-reddish whitespace-nowrap font-inter">
                ₦{unitPrice.toLocaleString()}
              </span>
            </div>

            {/* Counter row */}
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-[500] font-inter">
                How many people?
              </span>
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={decrement}
                  disabled={quantity <= 1}
                  className="w-7 h-7 rounded-full border border-gray-300 text-[15px] flex items-center justify-center disabled:opacity-40 active:scale-95 transition-transform"
                >
                  −
                </button>
                <span className="text-[15px] font-[500] min-w-[14px] text-center font-inter">
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

            {/* Total */}
            <div className="border-t border-gray-100 pt-3.5 flex items-center justify-between">
              <span className="text-[13px] text-gray-500 font-inter">
                Total for {quantity} {quantity === 1 ? "person" : "people"}
              </span>
              <span className="text-[17px] font-[500] text-reddish font-inter">
                ₦{total.toLocaleString()}
              </span>
            </div>
          </div>
        </TabsContent>
        {/* Payment Details */}

        {/* Payment */}
        <TabsContent value="payment">
          <div className="w-full max-w-[420px] mx-auto rounded-2xl bg-white border border-gray-100 p-5 flex flex-col gap-4">
            <p className="text-[15px] font-[500] font-header">
              Complete payment
            </p>

            <div>
              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <span className="text-[13px] text-gray-500 font-inter">
                  Name
                </span>
                <span className="text-[13px] font-[500] font-inter">
                  {user?.fullName}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <span className="text-[13px] text-gray-500 font-inter">
                  Number of people
                </span>
                <span className="text-[13px] font-[500] font-inter">
                  {quantity}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <span className="text-[13px] text-gray-500 font-inter">
                  Reference
                </span>
                <span className="text-[12px] font-[500] font-mono">
                  {reference ?? "Generated on payment"}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3.5 pb-1">
                <span className="text-[13px] text-gray-500 font-inter">
                  Amount
                </span>
                <span className="text-[18px] font-[500] text-reddish font-inter">
                  ₦{total.toLocaleString()}
                </span>
              </div>
            </div>

            {error && (
              <p className="text-[13px] text-red-500 font-inter">{error}</p>
            )}

            <button
              onClick={handlePayment}
              disabled={paymentPending}
              className="w-full h-11 rounded-[10px] bg-reddish text-white text-[14px] font-[500] font-inter disabled:opacity-60"
            >
              {paymentPending
                ? "Redirecting..."
                : `Pay ₦${total.toLocaleString()}`}
            </button>

            <p className="text-center text-[12px] text-gray-400 font-inter">
              Secured by Paystack
            </p>
          </div>
        </TabsContent>
        {/* Payment Details */}

        {/* Replace TabsList with a standard layout div */}
        <div className="flex justify-between py-4">
          {/* Back Button (Standard Button Primitive) */}
          <Button
            type="button"
            // Cleaned up classes so the disabled state correctly handles the cursor
            className="w-[30%] font-rubik text-[14px] py-3 text-white bg-reddish disabled:bg-reddish/50 disabled:cursor-not-allowed cursor-pointer"
            disabled={tabState === "mode"}
            onClick={() => {
              switch (tabState) {
                case "verify-code":
                  setTabState("mode");
                  break;

                case "paymentDetails":
                  setTabState("mode");
                  break;

                case "payment":
                  setTabState("paymentDetails");
                  break;
              }
            }}
          >
            Back
          </Button>

          {/* Next Button (Standard Button Primitive) */}
          <Button
            type="button"
            className="w-[30%] font-rubik text-[14px] py-3 text-white bg-primary-main disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            disabled={tabState === "successful"}
            onClick={() => {
              switch (tabState) {
                case "mode":
                  setTabState(
                    registrationMode === "code"
                      ? "verify-code"
                      : "paymentDetails",
                  );
                  break;

                case "paymentDetails":
                  setTabState("payment");
                  break;

                case "verify-code":
                  // handle verification flow
                  break;

                case "payment":
                  // handle payment
                  break;
              }
            }}
          >
            Next
          </Button>
        </div>
      </Tabs>
    </div>
  );
}
