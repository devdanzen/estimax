import Card from './Card';

export default function Roadmap() {
  const roadmapItems = [
    {
      phase: 'Phase 1',
      title: 'Core AI Engine',
      description: 'Advanced material cost calculation algorithms with real-time pricing data.',
      status: 'completed',
      features: ['Basic material estimation', 'Cost calculations', 'PDF exports']
    },
    {
      phase: 'Phase 2',
      title: 'Enhanced Integration',
      description: 'Connect with popular project management and accounting software.',
      status: 'in-progress',
      features: ['API integrations', 'Cloud sync', 'Team collaboration']
    },
    {
      phase: 'Phase 3',
      title: 'Advanced Analytics',
      description: 'Predictive analytics and market trend analysis for better estimates.',
      status: 'planned',
      features: ['Market insights', 'Trend analysis', 'Custom reports']
    },
    {
      phase: 'Phase 4',
      title: 'Mobile & Automation',
      description: 'Mobile apps and automated estimate generation from project blueprints.',
      status: 'planned',
      features: ['Mobile apps', 'Blueprint scanning', 'Auto-generation']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planned':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'planned':
        return 'Planned';
      default:
        return 'Planned';
    }
  };

  return (
    <section id="roadmap" className="section-padding bg-white">
      <div className="container">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold" style={{marginBottom: '3rem'}}>
            What&apos;s next?
          </h2>
          <div className="flex justify-center" style={{marginBottom: '4rem'}}>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl text-center leading-relaxed">
              Our development roadmap focuses on continuous improvement and new features 
              to make material estimation even more powerful and accessible.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {roadmapItems.map((item, index) => (
            <Card key={index} className="relative" padding="large">
              {/* Status Badge */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mb-4 ${getStatusColor(item.status)}`}>
                {getStatusText(item.status)}
              </div>

              {/* Phase Label */}
              <div className="text-sm text-blue-600 font-semibold mb-2">
                {item.phase}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {item.description}
              </p>

              {/* Features List */}
              <div className="space-y-2">
                {item.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}