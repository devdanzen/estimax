import Header from '../components/Header';
import Hero from '../components/Hero';
import TargetAudience from '../components/TargetAudience';
import Features from '../components/Features';
import Roadmap from '../components/Roadmap';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <TargetAudience />
        <Features />
        <Roadmap />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
