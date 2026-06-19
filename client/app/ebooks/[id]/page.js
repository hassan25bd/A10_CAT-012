import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import EbookDetailPage from '../../../components/ebooks/EbookDetailPage';

export default function Page({ params }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <EbookDetailPage id={params.id} />
      </main>
      <Footer />
    </>
  );
}
