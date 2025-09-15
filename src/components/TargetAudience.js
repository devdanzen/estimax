import Card from './Card';

export default function TargetAudience() {
  const audiences = [
    {
      title: 'Electrical Contractors',
      description: 'Get detailed electrical estimates and material takeoffs for residential, commercial, and industrial projects.',
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: 'Engineering Firms',
      description: 'Professional electrical estimating services to support your design and project planning processes.',
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: 'General Contractors',
      description: 'Accurate electrical cost estimates and material takeoffs to support your bidding and project management.',
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ];

  return (
    <section id="features" className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-32">
          <h2 className="font-title text-4xl md:text-5xl font-bold" style={{marginBottom: '3rem'}}>
            Who We Serve
          </h2>
          <div className="flex justify-center" style={{marginBottom: '4rem'}}>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl text-center leading-relaxed">
              Our professional electrical estimating services are designed for contractors, 
              engineers, and businesses who need detailed and accurate estimates.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 space-y-8 md:space-y-0">
          {audiences.map((audience, index) => (
            <Card key={index} className="text-center" padding="large">
              <div className="flex justify-center mb-10">
                {audience.icon}
              </div>
              <h3 className="font-title text-2xl font-bold mb-8 text-gray-900">
                {audience.title}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {audience.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}