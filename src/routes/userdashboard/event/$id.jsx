import { useQueryClient, useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../lib/AuthContext'
import MultiSteps from '../../../components/MultiStep/MultiStep'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/userdashboard/event/$id')({
  component: SingleEvent,
})

function SingleEvent() {
  const { userData, userRegisteredEvents } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { id } = Route.useParams()
  const [cachedEvent, setCachedEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false)
  const backendURL = import.meta.env.VITE_BACKEND_URL

  // Check for payment verification on mount (BEFORE trying to load event)
  useEffect(() => {
    const verifyPaymentFromURL = async () => {
      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search)
      const reference = urlParams.get('reference') || urlParams.get('trxref')
      
      if (!reference) {
        console.log('No payment reference found in URL')
        return false
      }

      console.log('Payment reference found in URL:', reference)
      setIsVerifyingPayment(true)

      try {
        // Step 1: Verify payment with backend
        console.log('Verifying payment...')
        const verifyResponse = await axios.post(`${backendURL}/api/payment/verify-payment`, {
          reference,
          userId: userData?.uniqueId
        })

        const verificationResult = verifyResponse.data.data
        console.log('Payment verification result:', verificationResult)

        if (verificationResult.status !== 'success') {
          toast.error('Payment verification failed')
          return false
        }

        // Step 2: Get event details for registration
        const eventResponse = await axios.get(`${backendURL}/api/events/${id}`)
        const eventData = eventResponse.data.data || eventResponse.data
        
        if (!eventData) {
          throw new Error('Event not found')
        }

        // Step 3: Extract payment option and amount from metadata
        const metadata = verificationResult.metadata || {}
        const paymentOption = metadata.paymentOption || 'single'
        const amountPaid = verificationResult.amount / 100 // Convert from kobo
        const single = 100 // Same as in PayStack component
        const numberOfPayment = paymentOption === 'multiple' 
          ? Math.floor(amountPaid / single) - 1 
          : 0

        // Step 4: Register the event
        console.log('Registering event...')
        const registrationData = {
          uniqueID: userData?.uniqueId,
          fullName: userData?.fullName,
          email: userData?.email,
          eventId: eventData._id,
          eventTitle: eventData.eventTitle,
          paymentOption: paymentOption,
          parish: userData?.parish,
          archdeaconry: userData?.archdeaconry,
          paymentStatus: verificationResult.status,
          reference: verificationResult.reference,
          modeOfPayment: verificationResult.channel,
          paymentTime: verificationResult.paid_at,
          paymentID: verificationResult.id,
          amountOfPeople: paymentOption === 'multiple' ? String(numberOfPayment + 1) : "1"
        }

        const registerResponse = await axios.post(
          `${backendURL}/api/userRegisteredEvents`,
          registrationData
        )

        console.log('Registration response:', registerResponse.data)

        // Step 5: Generate and save codes if multiple payment
        if (paymentOption === 'multiple' && numberOfPayment > 0) {
          console.log('Generating codes for multiple payment...')
          
          const codesGenerated = await axios.post(`${backendURL}/api/payment/generate-code`, {
            numberOfPersons: numberOfPayment
          })

          await axios.post(`${backendURL}/api/payment/save-codes`, {
            payerId: userData?.uniqueId,
            payerArchdeaconry: userData?.archdeaconry,
            eventId: eventData._id,
            eventTitle: eventData.eventTitle,
            codes: codesGenerated?.data?.data
          })

          console.log('Codes generated and saved successfully')
        }

        // Step 6: Invalidate queries to refresh data
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['allEvent'] }),
          queryClient.invalidateQueries({ queryKey: ['userRegisteredEvents'] }),
          queryClient.invalidateQueries({ queryKey: ['userPaymentRecord'] })
        ])

        toast.success('Payment successful! Registration completed.')
        
        // Clean up URL and redirect
        window.history.replaceState({}, '', window.location.pathname)
        
        setTimeout(() => {
          navigate({ to: '/userdashboard' })
        }, 1500)

        return true

      } catch (error) {
        console.error('Payment verification/registration error:', error)
        toast.error(`Payment Error: ${error.response?.data?.message || error.message}`)
        
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname)
        return false
      } finally {
        setIsVerifyingPayment(false)
      }
    }

    verifyPaymentFromURL()
  }, [id, userData, backendURL, navigate, queryClient])

  // Fetch event directly if not in cache
  const { data: fetchedEvent, isLoading: isFetching } = useQuery({
    queryKey: ['singleEvent', id],
    queryFn: async () => {
      const response = await axios.get(`${backendURL}/api/events/${id}`)
      return response.data.data || response.data
    },
    enabled: !cachedEvent && !!id && !isVerifyingPayment,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })

  useEffect(() => {
    if (isVerifyingPayment) {
      return // Don't try to load event while verifying payment
    }

    setLoading(true)
    setError(null)

    try {
      // Try to get from cache
      const cachedEvents = queryClient.getQueryData(['allEvent', userData?.uniqueId, userRegisteredEvents])
      
      console.log("Cached Events: ", cachedEvents, "user Details", userData, "User Registered Events: ", userRegisteredEvents, "id:", id)
      
      if (cachedEvents && Array.isArray(cachedEvents)) {
        const event = cachedEvents.find((event) => event?._id === id)
        if (event) {
          setCachedEvent(event)
          setLoading(false)
          return
        }
      }

      // If not in cache but we have fetched data, use that
      if (fetchedEvent) {
        setCachedEvent(fetchedEvent)
        setLoading(false)
        return
      }

      // If still loading from API
      if (isFetching) {
        setLoading(true)
        return
      }

      // If we've tried everything and still no event
      if (!isFetching && !fetchedEvent && !cachedEvent) {
        setError('Event not found')
        setLoading(false)
      }

    } catch (err) {
      console.error('Error loading event:', err)
      setError('Failed to load event')
      setLoading(false)
    }
  }, [queryClient, id, userData?.uniqueId, userRegisteredEvents, fetchedEvent, isFetching, isVerifyingPayment])

  console.log('Cached Event: ', cachedEvent)

  // Payment verification state
  if (isVerifyingPayment) {
    return (
      <div className="bg-[#f4f7fa] py-[30px] font-rubik border min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <Loader2 className="w-16 h-16 animate-spin text-primary-main mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">
            Please wait while we confirm your payment and complete your registration...
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Do not close this window or refresh the page.
          </p>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading || isFetching) {
    return (
      <div className="bg-[#f4f7fa] py-[30px] font-rubik border min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !cachedEvent) {
    return (
      <div className="bg-[#f4f7fa] py-[30px] font-rubik border min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error || 'We couldn\'t find the event you\'re looking for. It may have been removed or the link is incorrect.'}
          </p>
          <button
            onClick={() => {
              queryClient.invalidateQueries(['allEvent', userData?.uniqueId])
              window.location.reload()
            }}
            className="bg-primary-main text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate({ to: '/userdashboard' })}
            className="ml-3 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f4f7fa] py-[30px] font-rubik border">
      <div className="flex items-center basis-[50%]">
        <MultiSteps userData={userData} eventDetails={cachedEvent} />
      </div>
    </div>
  )
}