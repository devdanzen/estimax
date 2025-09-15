import Link from 'next/link';
import Button from './Button';

export default function FinalCTA() {
  return (
    <section id="estimate" className="section-padding bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h2 className="text-4xl md:text-6xl font-bold" style={{marginBottom: '3rem'}}>
            Let&apos;s TRY!
          </h2>

          {/* Subheadline */}
          <div className="flex justify-center" style={{marginBottom: '4rem'}}>
            <p className="text-xl md:text-2xl opacity-90 max-w-4xl text-center leading-relaxed">
              Ready to revolutionize your material estimation process? 
              Start getting accurate estimates in minutes, not hours.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href="/estimator">
              <Button
                variant="secondary"
                size="large"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Get Demo
              </Button>
            </Link>
            <Button
              variant="outline"
              size="large"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Contact
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20 pt-16 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">10+</div>
              <div className="text-white/80">Projects Estimated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-white/80">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">10x</div>
              <div className="text-white/80">Faster Estimates</div>
            </div>
          </div>

          {/* Small Print */}
          <div className="mt-12 text-sm text-white/70">
            No credit card required • Free 14-day trial • Cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
}