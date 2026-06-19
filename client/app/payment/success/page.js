import { Suspense } from 'react';
import PaymentSuccessContent from '../../../components/payment/PaymentSuccessContent';

export const metadata = { title: 'Payment Successful – Fable' };

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
