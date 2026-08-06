import { createLazyFileRoute } from "@tanstack/react-router";
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
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useVerifyCode } from "@/features/dashboard/hooks/useRegisterEvents";

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
  const {
    data: event,
    isLoading,
    error: fetchError,
  } = useGetSingleEventData(id);
  const [tabState, setTabState] = useState("mode");
  const [code, setCode] = useState("");
  const { mutate: verifyCode, isPending, error } = useVerifyCode(id, code);
  const [registrationMode, setRegistrationMode] = useState("paymentDetails");
  const [quantity, setQuantity] = useState(1);
  console.log("Id: ", id ,"Events: ", event, "Is Loading: ", isLoading, "errpr: ", error);

  const unitPrice = parseFloat(event?.eventPrice) || 0;
  const total = unitPrice * quantity;
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) => Math.min(10, q + 1));
  // // const paymentReference = `TXN_${userDetails?.uniqueId?.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now()}`
  if (isLoading) {
    return <div>Loading event details...</div>;
  }

  if (fetchError || !event) {
    return <div>Failed to load event data.</div>;
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
              htmlFor="paymentDetails"
              onClick={() => setRegistrationMode("paymentDetails")}
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
                value="paymentDetails"
                id="paymentDetails"
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
        <TabsContent value="paymentDetails" className="">
          <div className="w-full rounded-2xl bg-card/50 bg-white backdrop-blur-sm py-10 px-6 gap-3 flex flex-col items-center justify-center">
            <h2 className="font-bold text-[19px] font-header text-center tracking-tight">
              {/* Diocesan Youth Conference */}
              {event?.eventTitle}
            </h2>
            <p className="font-inter">
              <span className="font-[700] text-reddish">
                ₦{unitPrice.toLocaleString()}
              </span>
            </p>

            {/* Number counter */}
            <div className="flex items-center gap-4 mt-2">
              <button
                type="button"
                onClick={decrement}
                disabled={quantity <= 1}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-lg font-semibold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-transform"
              >
                −
              </button>

              <span className="w-8 text-center font-bold text-[18px] font-inter">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increment}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-reddish text-white text-lg font-semibold active:scale-95 transition-transform"
              >
                +
              </button>
            </div>
          </div>

          {/* Total price section */}
          <div className="w-full rounded-2xl bg-card/50 bg-white backdrop-blur-sm py-6 px-6 mt-3 flex items-center justify-between font-inter">
            <span className="text-gray-500 text-sm">
              Total ({quantity} {quantity === 1 ? "member" : "members"})
            </span>
            <span className="font-[700] text-reddish text-[19px]">
              ₦{total.toLocaleString()}
            </span>
          </div>
        </TabsContent>
        {/* Payment Details */}

        {/* Payment Details */}
        <TabsContent value="payment" className="flex justify-center">
          <div className="w-full max-w-[420px] rounded-2xl bg-card/50 bg-white backdrop-blur-sm py-10 px-7 gap-6 flex flex-col items-center justify-center font-inter">
            <div className="text-center flex flex-col gap-1.5">
              <h2 className="font-bold text-xl font-header tracking-tight">
                Complete payment
              </h2>
              <p className="text-[13px] text-gray-500">
                Review your details before you pay
              </p>
            </div>

            <div className="w-full rounded-xl bg-gray-50 px-5">
              <div className="flex items-center justify-between py-3.5 border-b border-gray-200">
                <span className="text-[13px] text-gray-500">Name</span>
                <span className="text-[14px] font-[500]">{`attendeeName`}</span>
              </div>
              <div className="flex items-center justify-between py-3.5 border-b border-gray-200">
                <span className="text-[13px] text-gray-500">
                  Number of people
                </span>
                <span className="text-[14px] font-[500]">{quantity}</span>
              </div>
              <div className="flex items-center justify-between py-3.5 border-b border-gray-200">
                <span className="text-[13px] text-gray-500">Reference</span>
                <span className="text-[13px] font-[500] font-mono">
                  {/* {reference ?? "Generated on payment"} */}
                  {"Generated on payment"}
                </span>
              </div>
              <div className="flex items-center justify-between py-3.5">
                <span className="text-[13px] text-gray-500">Amount</span>
                <span className="text-[20px] font-[500] text-reddish">
                  ₦{total.toLocaleString()}
                </span>
              </div>
            </div>

            {error && <p className="text-[13px] text-red-500 -mt-2">{error}</p>}

            <button
              // onClick={handlePay}
              // disabled={loading}
              className="w-full h-12 rounded-xl bg-[#0BA478] text-white text-[15px] font-[500] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60"
            >
              {/* {loading ? "Redirecting..." : `Pay ₦${total.toLocaleString()}`} */}
            </button>

            <p className="text-[12px] text-gray-400 flex items-center gap-1.5">
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
              switch (registrationMode) {
                case "code":
                  setTabState("mode");
                  break;
                case "paymentDetails":
                  setTabState("mode");
                  break;
                case "payment":
                  setTabState("paymentDetails");
                  setRegistrationMode("paymentDetails");
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
              switch (registrationMode) {
                case "code":
                  setTabState("verify-code");
                  break;
                case "paymentDetails":
                  setTabState("paymentDetails");
                  setRegistrationMode("payment");
                  break;
                case "payment":
                  setTabState("payment");
                  // setRegistrationMode("payment");
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
