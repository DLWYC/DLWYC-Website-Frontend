import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PaymentSelection from './paymentSelection';
import Form from './Forms';
import { formStep } from '@/data/Forms';
import PayStack from './PayStack';
import  Confirmation from './Confirmation'
import { ScrollArea } from "@/components/ui/scroll-area"


// Custom MultiStep component that mimics react-multistep

const MultiStep = ({
  steps,
  stepCustomStyle,
  prevButton,
  nextButton,
  showNavigation = true,
  showTitles = true,
  direction = 'row'
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="multistep-container relative">
      {/* **************** Step Indicator  **************** */}
      {showTitles && (
        <div className="flex items-center justify-center mb-8 text-center bg-[white] lg:p-2 px-5 py-3 rounded-md" style={{ flexDirection: direction }}>
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex flex-col items-center ${direction === 'column' ? 'mb-4' : ''}`}>
                <div className={`w-[35px] h-[35px] rounded-full flex items-center justify-center text-[15px] font-medium transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-primary-main text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <span className={`mt-2 text-xs lg:flex hidden font-medium transition-colors ${
                  index === currentStep ? 'text-primary-main' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>

              {index < steps.length - 1 && direction === 'row' && (
                <div className={`w-16 h-[5px] rounded-full mx-3 transition-colors duration-300 ${
                  index < currentStep ? 'bg-reddish' : 'bg-gray-200'
                }`} />
                
              )}
            </div>
          ))}
        </div>
      )}
      {/* **************** Step Indicator  **************** */}

      {/* Step Content */}
      <ScrollArea 
        className="step-content-container min-h-[300px] flex items-center justify-center" //
        style={stepCustomStyle}
      >
        <div className="w-full">
          {currentStepData.component}
        </div>
      </ScrollArea>

      {/* Navigation Buttons */}
      {showNavigation && (
        <div className="flex lg:flex-row lg:justify-between lg:items-center flex-col-reverse text-center gap-2 mt-8">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            style={{
              ...prevButton.style,
              opacity: currentStep === 0 ? 0.5 : 1,
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
            }}
            className="flex items-center transition-all duration-200 hover:shadow-md disabled:hover:shadow-none"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {prevButton.title}
          </button>
          
          <div className="lg:text-[15px] text-[13px] text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </div>
          
          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            style={{
              ...nextButton.style,
              opacity: currentStep === steps.length - 1 ? 0.5 : 1,
              cursor: currentStep === steps.length - 1 ? 'not-allowed' : 'pointer'
            }}
            className="flex items-center transition-all duration-200 hover:shadow-md disabled:hover:shadow-none "
          >
            {nextButton.title}
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
};



// Main component
const MultiSteps = ({userData, eventDetails}) => {
     const [selectedOption, setSelectedOption] = useState('single');
  const [values, setValues] = useState({});
  const [paymentCodeStatus, setPaymentCodeStatus] = useState()
     
  useEffect(()=>{
     setValues({
    "uniqueID": userData?.uniqueId,
    "fullName": userData?.fullName,
    "email": userData?.email,
    "eventId": eventDetails._id,
    "eventTitle": eventDetails.eventTitle,
    "paymentOption": selectedOption,
    "parish": userData?.parish,
    "archdeaconry": userData?.archdeaconry
     })
  }, [userData, eventDetails])


  const steps = useMemo(() => {
  const baseSteps = [
    {
      title: 'Payment Type',
      component: <PaymentSelection 
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />,
    },
    {
      title: 'Confirm Details',
      component: <Form 
        array={formStep} 
        values={values} 
        setValues={setValues} 
        setPaymentCodeStatus={setPaymentCodeStatus} 
        selectedOption={selectedOption}
      />,
    },
  ];

  // Logic for showing steps based on payment mode and code status
  if (selectedOption === 'single') {
    // For single payment mode
    if (paymentCodeStatus === "Valid Code") {
      // Show Confirm Payment step when code is valid
      baseSteps.push({
        title: 'Confirm Payment',
        component: <Confirmation values={values} modeOfPayment={"Code"}    />,
      });
    } else {
      // Show Proceed To Payment step by default or when code is invalid
      // This covers: empty string, undefined, "Invalid Code", or any other status
      baseSteps.push({
        title: 'Proceed To Payment',
        component: <PayStack 
          userDetails={userData} 
          paymentOption={selectedOption} 
          values={values} 
          setValues={setValues} 
        />,
      });
    }
  } else if (selectedOption === 'multiple') { // Changed 'Multiple' to 'multiple' for consistency
    baseSteps.push({
      title: 'Proceed To Payment',
      component: <PayStack 
        userDetails={userData} 
        paymentOption={selectedOption} 
        values={values} 
        setValues={setValues} 
      />,
    });
  }
  
  return baseSteps;
}, [selectedOption, paymentCodeStatus, userData, values, formStep]);

  return (
       <div className="p-6 rounded-xl  w-full mx-auto">
       {console.log("All Gathered: ", paymentCodeStatus)}
      <MultiStep
        steps={steps}
        stepCustomStyle={{
          transition: 'all 0.3s ease-in-out',
        }}
       prevButton={{
  title: 'Back',
  style: {
    backgroundColor: '#ab0606',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px', // Space between icon and text
  },
}}
nextButton={{
  title: 'Continue',
  style: {
    backgroundColor: '#091e54',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px', // Space between icon and text
  },
}}
        showNavigation={true}
        showTitles={true}
        // direction="column"
      />
    </div>
  );
};

export default MultiSteps;