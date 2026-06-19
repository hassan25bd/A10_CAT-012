import { Suspense } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BrowsePage from '../../components/browse/BrowsePage';

export const metadata = { title: 'Browse Ebooks – Fable' };

function Loading() {
  return (
    <div className="bg-dark-900 min-h-screen pt-24 pb-20 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Suspense fallback={<Loading />}>
          <BrowsePage />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
