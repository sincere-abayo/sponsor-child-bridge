import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faLinkedinIn 
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-blue-700 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-white">Stay Updated</h3>
              <p className="text-blue-100 mt-1">Subscribe to our newsletter for the latest news and updates.</p>
            </div>
            <div className="w-full md:w-auto">
              <form className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-white text-blue-700 px-6 py-2 rounded-md font-medium hover:bg-blue-50 transition duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold mb-4">Sponsor Bridge</h3>
            <p className="text-gray-400 mb-4">
              Connecting sponsors with children in need, making a difference one sponsorship at a time.
            </p>
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gray-800 hover:bg-blue-600 h-10 w-10 rounded-full flex items-center justify-center transition duration-300"
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gray-800 hover:bg-blue-400 h-10 w-10 rounded-full flex items-center justify-center transition duration-300"
                aria-label="Twitter"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gray-800 hover:bg-pink-600 h-10 w-10 rounded-full flex items-center justify-center transition duration-300"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gray-800 hover:bg-blue-700 h-10 w-10 rounded-full flex items-center justify-center transition duration-300"
                aria-label="LinkedIn"
              >
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-white transition duration-200">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-gray-400 hover:text-white transition duration-200">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Resources */}
          <div>
            <h3 className="text-xl font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-400 hover:text-white transition duration-200">
                  Educational Resources
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-gray-400 hover:text-white transition duration-200">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FontAwesomeIcon icon={faEnvelope} className="text-blue-400 mt-1 mr-3" />
                <span className="text-gray-400">
                  <a href="mailto:info@sponsorbridge.org" className="hover:text-white transition duration-200">
                    info@sponsorbridge.org
                  </a>
                </span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faPhone} className="text-blue-400 mt-1 mr-3" />
                <span className="text-gray-400">
                  <a href="tel:+250788224455" className="hover:text-white transition duration-200">
                    +250 788 224 455
                  </a>
                </span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-400 mt-1 mr-3" />
                <span className="text-gray-400">
                  Kigali, Rwanda<br />
                  East Africa
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Sponsor Bridge. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition duration-200">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition duration-200">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition duration-200">
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link to="/sitemap" className="text-gray-400 hover:text-white text-sm transition duration-200">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
