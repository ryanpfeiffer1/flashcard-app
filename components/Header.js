'use client'; // Ensure it's client-side rendered

import React, { useState } from 'react';

const Navbar = () => {
  // State to toggle the mobile menu visibility
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-gray-900 p-4 shadow-lg">
      <nav className="flex justify-between items-center max-w-screen-xl mx-auto">
        {/* Brand Name with Bold, Modern Font */}
        <a
          href="#"
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mr-8 tracking-wide"
        >
          QuickCardAI
        </a>

        {/* Desktop Navigation Links */}
        <div className="space-x-8 text-lg font-semibold text-gray-300 hidden lg:flex items-center">
          <a href="#" className="hover:text-teal-400 transition duration-300 transform hover:scale-105">Home</a>
          <a href="#" className="hover:text-teal-400 transition duration-300 transform hover:scale-105">Create Flashcards</a>
          <a href="#" className="hover:text-teal-400 transition duration-300 transform hover:scale-105">Study Mode</a>
          <a href="#" className="hover:text-teal-400 transition duration-300 transform hover:scale-105">My Decks</a>
          <a href="#" className="hover:text-teal-400 transition duration-300 transform hover:scale-105">Account</a>
          <a href="#" className="hover:text-teal-400 transition duration-300 transform hover:scale-105">Help</a>
        </div>

        {/* Mobile Menu Button (Waffle Icon) */}
        <div className="lg:hidden">
          <button
            className="text-white hover:text-teal-400 cursor-pointer"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} // Toggle menu on click
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu (Only shown when isMobileMenuOpen is true) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="flex flex-col space-y-4 text-lg font-semibold text-gray-300 p-4">
            <a href="#" className="hover:text-teal-400 transition duration-300 transform hover:scale-105">Home</a>
            <a href="#" className="hover:text-teal-400 transition duration-300 transform hover:scale-105">Create Flashcards</a>
            <a href="#" className="hover:text-teal-400 transition duration-300 transform hover:scale-105">Study Mode</a>
            <a href="#" className="hover:text-teal-400 transition duration-300 transform hover:scale-105">My Decks</a>
            <a href="#" className="hover:text-teal-400 transition duration-300 transform hover:scale-105">Account</a>
            <a href="#" className="hover:text-teal-400 transition duration-300 transform hover:scale-105">Help</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
