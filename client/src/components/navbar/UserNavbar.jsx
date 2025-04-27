import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import {
  FaBars,
  FaTimes,
  FaUserAlt,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import { BiBell } from "react-icons/bi";
import { ToastHandler } from "../myToast/ToastHandler";
import { userLogout } from "../../redux/user/userSlice";

const UserNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userState } = useSelector((store) => store.user);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Explore", path: "/" },
    { name: "Top Rated Books", path: "/top-rated" },
    { name: "My Bookshelf", path: "/my-bookshelf" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(userLogout());
    ToastHandler("suc", "Logout successfully!");
    setProfileDropdownOpen(false);
    navigate("/login");
  };

  const handleProfileClick = () => {
    setProfileDropdownOpen(false);
    navigate("/profile");
  };

  const getUserInitials = () => {
    if (!userState?.name) return "U";
    return userState.name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase();
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

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors duration-200 text-[var(--text-secondary)] hover:text-[var(--primary)]">
              <BiBell size={20} />
            </button>

            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white">
                  <span className="text-sm font-medium">
                    {getUserInitials()}
                  </span>
                </div>
                <FaChevronDown
                  size={12}
                  className={`text-[var(--text-secondary)] transition-transform duration-200 ${
                    profileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-primary)] rounded-lg shadow-xl py-1 z-50 border border-[var(--bg-secondary)] divide-y divide-[var(--bg-secondary)]">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {userState?.name}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">
                      {userState?.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--primary)] transition-colors"
                    >
                      <FaUserAlt className="mr-3" size={14} />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--primary)] transition-colors"
                    >
                      <FaSignOutAlt className="mr-3" size={14} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] focus:outline-none"
            >
              <span className="sr-only">Open menu</span>
              {!isOpen ? <FaBars size={20} /> : <FaTimes size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
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
          <div className="pt-4 pb-3 border-t border-[var(--bg-secondary)] px-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white">
                <span className="text-sm font-medium">{getUserInitials()}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {userState?.name}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {userState?.email}
                </p>
              </div>
              <button className="ml-auto p-2 rounded-full hover:bg-[var(--bg-secondary)]">
                <BiBell size={20} className="text-[var(--text-secondary)]" />
              </button>
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={() => {
                  handleProfileClick();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--primary)]"
              >
                <div className="flex items-center">
                  <FaUserAlt className="mr-3" size={14} />
                  Profile
                </div>
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--primary)]"
              >
                <div className="flex items-center">
                  <FaSignOutAlt className="mr-3" size={14} />
                  Logout
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
