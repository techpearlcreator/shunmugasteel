import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { paymentService } from '../services/paymentService'

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const quoteId     = searchParams.get('quote_id')
  const quoteNumber = searchParams.get('quote_number')
  const paymentId   = searchParams.get('payment_id')

  const [payment, setPayment] = useState(null)

  useEffect(() => {
    if (quoteId) {
      paymentService.getPaymentByQuote(quoteId)
        .then((res) => setPayment(res.data?.data || res.data))
        .catch(() => {})
    }
  }, [quoteId])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#E67E22' }}>
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 text-sm mb-8">
          Your payment has been received. Our team will now arrange dispatch and contact you with updates.
        </p>

        {/* Payment details card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-left mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Payment Details</h3>
          <div className="space-y-3">
            {quoteNumber && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Quote Number</span>
                <span className="font-semibold text-gray-800">{quoteNumber}</span>
              </div>
            )}
            {(paymentId || payment?.razorpay_payment_id) && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment ID</span>
                <span className="font-mono text-xs text-gray-700 break-all text-right max-w-[180px]">
                  {paymentId || payment?.razorpay_payment_id}
                </span>
              </div>
            )}
            {payment?.amount && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount Paid</span>
                <span className="font-bold" style={{ color: '#E67E22' }}>
                  &#8377;{Number(payment.amount).toLocaleString('en-IN')}
                </span>
              </div>
            )}
            {payment?.payment_method && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Method</span>
                <span className="text-gray-700 capitalize">{payment.payment_method}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded text-xs">Confirmed</span>
            </div>
          </div>
        </div>

        {/* What's next */}
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 text-left mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">What happens next?</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex gap-3">
              <span className="font-bold" style={{ color: '#E67E22' }}>1.</span>
              <span>You'll receive a payment receipt on your registered email.</span>
            </div>
            <div className="flex gap-3">
              <span className="font-bold" style={{ color: '#E67E22' }}>2.</span>
              <span>Our team will arrange the material and confirm dispatch details.</span>
            </div>
            <div className="flex gap-3">
              <span className="font-bold" style={{ color: '#E67E22' }}>3.</span>
              <span>You'll be notified once the material is dispatched.</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          {quoteId && (
            <Link
              to={'/my-quotes/' + quoteId}
              className="px-6 py-3 rounded-lg font-semibold text-white text-sm"
              style={{ background: '#E67E22' }}
            >
              View Order Status
            </Link>
          )}
          <Link
            to="/my-quotes"
            className="px-6 py-3 rounded-lg font-semibold border border-gray-300 text-gray-600 hover:border-gray-400 text-sm"
          >
            My Quotes
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Need help? Call <a href="tel:+917200240007" style={{ color: '#E67E22' }}>+91-7200240007</a> &bull; Mon–Sat 9AM–6PM
        </p>
      </div>
    </div>
  )
}
