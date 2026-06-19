import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HomePage from '../components/home/HomePage';

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HomePage />
      </main>
      <Footer />
    </>
  );
}
