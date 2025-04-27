import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { FaBars, FaTimes } from "react-icons/fa";

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const { userState } = useSelector((store) => store.user);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { name: "Explore", path: "/" },
    { name: "Top Rated Books", path: "/top-rated" },
    { name: "Login", path: "/login" },
    { name: "Sign Up", path: "/signup" },
  ];

  // Check if the nav item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-primary)] shadow-sm py-2 backdrop-blur-sm bg-opacity-90"
          : "bg-[var(--bg-primary)] py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand name */}
          <div className="flex-shrink-0 flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white overflow-hidden">
                <img
                  src={Logo}
                  alt="ProjectShelf Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-xl text-[var(--text-primary)]">
                ProjectShelf
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--primary)]"
                  }`}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <span className="absolute inset-x-1 -bottom-1 h-0.5 bg-[var(--primary)] rounded-full"></span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? <FaBars size={20} /> : <FaTimes size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="md:hidden absolute inset-x-0 top-16 bg-[var(--bg-primary)] shadow-lg rounded-b-lg overflow-hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-3 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? "bg-[var(--bg-secondary)] text-[var(--primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--primary)]"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;
