import { Link } from 'react-router-dom';
import { HiArrowRight, HiOutlinePhotograph, HiOutlineVideoCamera, HiOutlineSparkles } from 'react-icons/hi';

const HomePage = () => {
  return (
    <div className="min-h-full w-full flex flex-col px-6 py-8">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        {/* Logo & Title */}
        <div className="animate-fadeInUp mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-light mb-6">
            <HiOutlineSparkles className="text-indigo-400" />
            <span className="text-sm text-slate-300">AI-Powered Detection</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="gradient-text">uTECHsil</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 font-light max-w-xl mx-auto">
            When technology meets tradition, we unlock the secrets of the past
          </p>
        </div>

        {/* Hero Image */}
        <div className="animate-fadeInUp-delay-1 my-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative glass-card p-6 rounded-3xl">
              <img 
                src="/home.svg" 
                alt="uTECHsil Logo" 
                className="h-48 md:h-64 mx-auto animate-float"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="animate-fadeInUp-delay-2 text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Designed to preserve the rich traditional history of Nepal, uTECHsil allows you to explore 
          and discover the vibrant world of Nepali traditional utensils. Simply upload a photo or video, 
          and instantly identify traditional items with detailed information.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fadeInUp-delay-3 flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link
            to="/image"
            className="flex-1 btn-primary flex items-center justify-center gap-3 text-white"
          >
            <HiOutlinePhotograph className="text-xl" />
            <span>Image Detection</span>
            <HiArrowRight className="text-lg" />
          </Link>
          
          <Link
            to="/video"
            className="flex-1 btn-secondary flex items-center justify-center gap-3"
          >
            <HiOutlineVideoCamera className="text-xl" />
            <span>Live Detection</span>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 mb-8">
        <FeatureCard 
          icon="🎯"
          title="Accurate Detection"
          description="Advanced AI model trained on traditional Nepali utensils"
        />
        <FeatureCard 
          icon="⚡"
          title="Real-time Analysis"
          description="Instant results with live video and webcam support"
        />
        <FeatureCard 
          icon="📚"
          title="Rich Information"
          description="Detailed descriptions, uses, and cultural significance"
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass-card-light p-5 text-center card-hover">
    <div className="text-3xl mb-3">{icon}</div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-400">{description}</p>
  </div>
);
 
export default HomePage;
