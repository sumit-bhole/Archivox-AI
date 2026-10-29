import Hero from '../components/Hero';
import FlowSection from '../components/FlowSection';
import About from '../components/About';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 min-h-screen font-sans selection:bg-blue-500/30">
      <main>
        <Hero />
        <FlowSection />
        <About />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}