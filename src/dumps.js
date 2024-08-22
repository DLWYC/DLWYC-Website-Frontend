import { useQuery } from "@tanstack/react-query";


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
