import Card from './Card';

export default function Features() {
  const features = [
    {
      title: 'Material Takeoffs',
      description: 'Comprehensive material lists with quantities, specifications, and current pricing for all electrical components.',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      title: 'Accurate Estimates',
      description: 'Professional electrical cost estimates with labor, materials, and overhead calculations.',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Quick Turnaround',
      description: 'Fast delivery of detailed estimates and takeoffs to meet your project deadlines.',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Detailed Reports',
      description: 'Clear, organized reports with itemized costs, specifications, and professional formatting.',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <section id="benefits" className="section-padding bg-gray-50">
      <div className="container">
        <div className="text-center">
          <h2 className="font-title text-4xl md:text-5xl font-bold" style={{marginBottom: '3rem'}}>
            Professional Electrical Estimating.
            <br />
            <span className="gradient-text">Delivered With Precision.</span>
          </h2>
          <div className="flex justify-center" style={{marginBottom: '4rem'}}>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl text-center leading-relaxed">
              Our experienced team provides detailed electrical estimates and material takeoffs 
              to help you win more bids and manage projects efficiently.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <Card key={index} className="text-center bg-white" padding="large">
              <div className="w-16 h-16 mx-auto mb-8 bg-blue-50 rounded-full flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="font-title text-xl font-semibold mb-6 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}