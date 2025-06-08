import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHandHoldingHeart, FaGraduationCap, FaChartLine, FaUsers, FaComments, FaShieldAlt } from 'react-icons/fa';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/common/Button';

const Home = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  return (
    <MainLayout>
          {/* Hero Section with Background Image */}
          <div className="relative text-white">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ 
            backgroundImage: "url('https://media.sciencephoto.com/image/p9100076/800wm')",
          }}
            >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
              Connecting Sponsors with Those in Need
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl">
              SponsorBridge helps connect generous sponsors with individuals in need of support for education, healthcare, and more.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button variant="light" size="lg">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button variant="light" size="lg">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-blue-700">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-600">5,000+</p>
              <p className="text-gray-600 mt-2">Sponsors</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">12,000+</p>
              <p className="text-gray-600 mt-2">Recipients</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">$2.5M+</p>
              <p className="text-gray-600 mt-2">Funds Raised</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">30+</p>
              <p className="text-gray-600 mt-2">Countries</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">How It Works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to give and receive support
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Our platform makes it easy to connect sponsors with those who need support through a simple, transparent process.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                  <FaUsers className="h-8 w-8" />
                </div>
                <h3 className="text-xl leading-6 font-bold text-gray-900 mb-3">Create an Account</h3>
                <p className="text-base text-gray-500">
                  Sign up as a sponsor or as someone seeking support. Complete your profile with relevant information to get started.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                  <FaHandHoldingHeart className="h-8 w-8" />
                </div>
                <h3 className="text-xl leading-6 font-bold text-gray-900 mb-3">Connect</h3>
                <p className="text-base text-gray-500">
                  Sponsors can browse through profiles of individuals seeking support. Recipients can showcase their needs and goals.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                  <FaChartLine className="h-8 w-8" />
                </div>
                <h3 className="text-xl leading-6 font-bold text-gray-900 mb-3">Support & Track</h3>
                <p className="text-base text-gray-500">
                  Establish sponsorships, track progress, and communicate directly through our secure platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to make a difference
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-12">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <FaGraduationCap className="h-6 w-6" />
                  </div>
                  <h3 className="ml-4 text-xl leading-6 font-medium text-gray-900">Educational Support</h3>
                </div>
                <p className="text-base text-gray-500 ml-16">
                  Support students with tuition, books, supplies, and mentorship to help them achieve their educational goals.
                </p>
              </div>
              
              <div className="mb-12">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <FaComments className="h-6 w-6" />
                  </div>
                  <h3 className="ml-4 text-xl leading-6 font-medium text-gray-900">Direct Communication</h3>
                </div>
                <p className="text-base text-gray-500 ml-16">
                  Our platform enables secure, direct communication between sponsors and recipients to build meaningful relationships.
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <FaShieldAlt className="h-6 w-6" />
                  </div>
                  <h3 className="ml-4 text-xl leading-6 font-medium text-gray-900">Secure & Transparent</h3>
                </div>
                <p className="text-base text-gray-500 ml-16">
                  All transactions and communications are secure, with full transparency on how funds are being used.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-xl">
                <img 
                  src="https://globaladvocacyafrica.org/wp-content/uploads/2018/12/AFRICAN-CHILD-2.jpg" 
                  alt="Students studying" 
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-blue-100 rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Hear from our community
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img 
                    src="https://randomuser.me/api/portraits/women/32.jpg" 
                    alt="Sarah Johnson" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Sarah Johnson</h4>
                  <p className="text-blue-600">Sponsor</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Being able to directly support a student's education and see their progress has been incredibly rewarding. The platform makes it easy to stay connected."
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img 
                    src="https://media.istockphoto.com/id/1438969575/photo/smiling-young-male-college-student-wearing-headphones-standing-in-a-classroom.jpg?s=612x612&w=0&k=20&c=yNawJP9JGXU6LOL262ME5M1U2xxNKQsvT7F9DZhZCh4=" 
                    alt="Michael" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Michael</h4>
                  <p className="text-blue-600">Student</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Thanks to my sponsor, I've been able to continue my education and focus on my studies without worrying about financial constraints. It's changed my life."
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScbBcebq3Fg42NkZO7838coEPdUnOE-mpI2g&s" 
                    alt="Mugabe Robert" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Mugabe Robert</h4>
                  <p className="text-blue-600">Parent</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As a single parent, finding support for my child's education seemed impossible. SponsorBridge connected us with a wonderful sponsor who has helped us tremendously."
              </p>
            </div>
          </div>
        </div>
      </div>
      
   {/* CTA Section with Background Image */}
<div className="relative text-white py-16">
  {/* Background Image */}
  <div 
    className="absolute inset-0 bg-cover bg-center z-0" 
    style={{ 
      backgroundImage: "url('https://images.unsplash.com/photo-1509099836639-18ba1795216d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')",
    }}
  >
    {/* Dark overlay with blue tint for better text readability and brand consistency */}
    <div className="absolute inset-0 bg-blue-900 opacity-80"></div>
  </div>
  
  {/* Content */}
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to make a difference?</h2>
    <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
      Join our community today and start making a positive impact in someone's life.
    </p>
    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
      {isAuthenticated ? (
        <Link to="/dashboard">
          <Button variant="light" size="lg">
            Go to Dashboard
          </Button>
        </Link>
      ) : (
        <>
          <Link to="/register">
            <Button variant="light" size="lg">
              Get Started
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-blue-700">
              Sign In
            </Button>
          </Link>
        </>
      )}
    </div>
  </div>
</div>

      
      {/* FAQ Section */}
      <div className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">FAQ</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">How do I become a sponsor?</h3>
              <p className="text-gray-600">
                Simply create an account as a sponsor, complete your profile, and browse through recipients in need of support. You can then initiate a sponsorship request.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">How are recipients verified?</h3>
              <p className="text-gray-600">
                All recipients go through a verification process that includes document verification, background checks, and sometimes interviews to ensure authenticity.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">How much does it cost to sponsor someone?</h3>
              <p className="text-gray-600">
                Sponsorship amounts vary based on the recipient's needs and your capacity. You can choose to sponsor partially or fully, with options starting from as little as $50 per month.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Can I communicate with my sponsored recipient?</h3>
              <p className="text-gray-600">
                Yes, our platform provides a secure messaging system that allows direct communication between sponsors and recipients while maintaining privacy.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12 hidden ">
            <Link to="/faq">
              <Button variant="outline" size="md">
                View All FAQs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
