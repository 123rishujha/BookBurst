import React from "react";
import { Link } from "react-router-dom";
import { FiBook, FiHeart, FiMail, FiGithub, FiTwitter } from "react-icons/fi";
import { MdOutlineMenuBook } from "react-icons/md";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--bg-secondary)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <MdOutlineMenuBook className="text-3xl text-[var(--primary)] mr-2" />
              <span className="text-xl font-bold text-[var(--text-primary)]">BookShelf</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Discover, track, and share your reading journey with our community of book lovers.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                aria-label="GitHub"
              >
                <FiGithub size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter size={20} />
              </a>
              <a
                href="mailto:contact@bookshelf.com"
                className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                aria-label="Email"
              >
                <FiMail size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                  Explore Books
                </Link>
              </li>
              <li>
                <Link to="/top-rated" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                  Top Rated
                </Link>
              </li>
              <li>
                <Link to="/my-books" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                  My Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Stay Updated</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Subscribe to our newsletter for book recommendations and updates.
            </p>
            <form className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-[var(--text-secondary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--primary)] hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-[var(--bg-secondary)]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-[var(--text-secondary)]">
              © {currentYear} BookShelf. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex items-center">
              <span className="text-xs text-[var(--text-secondary)] flex items-center">
                Made with <FiHeart className="mx-1 text-red-500" /> for book lovers everywhere
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;