import Button from './Button';

export default function Hero() {
  return (
    <section id="home" className="pt-16 section-padding bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="font-title text-5xl md:text-6xl lg:text-7xl font-bold" style={{marginBottom: '2rem'}}>
            <span className="gradient-text">Electrical Estimating</span>
            <br />
            Cost Services
          </h1>

          {/* Subheadline */}
          <div className="flex justify-center" style={{marginBottom: '2rem'}}>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl text-center leading-relaxed">
              Delivers To You Detailed and Accurate Estimates & Material Takeoffs
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button size="large" href="#estimate">
              Get My Electrical Estimate
            </Button>
            <Button variant="outline" size="large" href="#features">
              View Services
            </Button>
          </div>

          {/* Hero Illustration/Pattern */}
          <div className="relative">
            <div className="w-full h-64 md:h-96 bg-white/50 rounded-2xl border border-white/20 shadow-xl backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">Professional Electrical Estimating Services</p>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full opacity-80"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-green-400 rounded-full opacity-80"></div>
            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-pink-400 rounded-full opacity-60"></div>
            <div className="absolute top-1/4 -left-8 w-3 h-3 bg-purple-400 rounded-full opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  );
}