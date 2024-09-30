import { useQuery } from "@tanstack/react-query";







 {/* Transaction/Payment ID: */}
 <div className="text-[15px] space-y-1">
 <Input
   error={error}
   removeError = {removeError}
   onInput={(e) => setTransactionID(e.target.value)}
   type="text"
   placeholder="Enter Transaction/Payment ID:"
   name="transactionID"
   label="Transaction/Payment ID"
 />
</div>

{/* Transaction/Payment ID: */}

{/* Payment Mode */}
<div className="text-[15px] space-x-3 space-y-3">
<p>Mode Of Payment: </p>
<div className="flex space-x-4">
 <label htmlFor="singleMode" className="flex items-center justify-center">Single <span className="text-gray-600 text-[14px]"> [Myself]</span>
 </label>
   <input type="radio" name="paymentMode" id="singleMode" value={'single'} className={'ml-3'} onClick={e => setPaymentMode(e.target.value)} />

 <label htmlFor="multipleMode" className="flex items-center justify-center">Multiple <span className="text-gray-600 lg:text-[14px] text-[10px]"> [Myself & Others]</span>
 </label>
   <input type="radio" name="paymentMode" id="multipleMode" value={'multiple'} onClick={e => setPaymentMode(e.target.value)} className="ml-3"/>
</div>

</div>

{/* Payment Mode */}

{/* Transaction/Payment ID: */}
{paymentMode === "multiple" ? (
 <div className="text-[15px] space-y-1">
 <Input
   error={error}
   removeError = {removeError}
   onInput={(e) => setTotalNumberOfCamperWithTransactionID(e.target.value)}
   type="number"
   placeholder="Enter Value"
   name="totalNumberOfCamperWithTransactionID
"
   label="Number Of Campers With the same Transaction ID"
 />
</div> 
) : (<></>)}
















const Events = () => {
     const {status, fetchStatus, data, error, isLoading} = useQuery({
          queryKey: ["registered", "one"],
          queryFn: async () => {
               const response = await fetch('https://api.github.com/repos/TanStack/query');
               if (!response.ok){
                    throw new Error(response.statusText);
               }
               return response.json()
          },
        });

        if(fetchStatus === 'fetching'){
          return <span>Fetching Data...</span>
        }
        else if (fetchStatus === 'paused'){
          return <span>paused {error}...</span>
        }

        if(isLoading){
          return <span> Still Loading </span>
        }

        if (status === 'pending'){
          return <span>Loading Data...</span>
        }
        else if(status === 'error'){
          return <span> Error: {error.message} </span>
        }

     return(
          <div className="">
          <ul>
          {}
               {data.description}
          </ul>
          </div>
     )
};

export default Events;




