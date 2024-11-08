import { useEffect, useState, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { FaCheckCircle, FaExclamationCircle, FaRegTimesCircle} from "react-icons/fa";



const Alert = (e) =>{

  const [show, setShow] = useState(e.status);

  useEffect(() => {
      setShow(e.status);
}, [e.status]);


     return (
          <div
            aria-live="assertive"
            className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 "
          >
            <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
              {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
              <Transition
                show={show}
                as={Fragment}
                enter="transform ease-out duration-300 transition"
                enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <FaExclamationCircle
                          className="h-6 w-6 text-reddish"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">
                          {e.header}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">{e.text}</p>
                      </div>
                      <div className="ml-4 flex flex-shrink-0">
                      
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
     )
}

export default Alert;