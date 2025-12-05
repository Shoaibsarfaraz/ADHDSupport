import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Settings } from 'lucide-react'; 
import { useAuth, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'; 
import { useUserProfile } from '../context/UserProfileContext.tsx'; // Imports userProfile

export function Navigation() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // 1. Get Authentication and User Profile Status
    const { isSignedIn } = useAuth();
    // Use userProfile for Mongo-backed data, including 'userType'
    const { userProfile, isProfileLoading } = useUserProfile(); 

    const closeMobileMenu = () => setMobileMenuOpen(false);

    // List of links that appear in the main navigation area
    const primaryNavLinks = useMemo(() => [
        { to: '/courses', name: 'Courses' },
        { to: '/events', name: 'Events' },
        { to: '/resources', name: 'Resources' },
    ], []);

    // List of links that typically require authentication
    const authLinks = useMemo(() => [
        { to: '/dashboard', name: 'Dashboard' },
        { to: '/productivity', name: 'Productivity Tools' },
        { to: '/profile', name: 'Profile' },
    ], []);
    
    // Admin link is conditional on profile being loaded and userType matching 'admin'
    const isAdmin = userProfile?.userType === 'admin';

    // Combine all navigation links for mobile view only
    const allLinks = useMemo(() => {
        let links = [...primaryNavLinks];
        if (isSignedIn && userProfile) { // Ensure profile is loaded before showing auth links
            links = links.concat(authLinks);
            if (isAdmin) {
                links.push({ to: '/admin', name: 'Admin' });
            }
        }
        return links;
    }, [primaryNavLinks, authLinks, isSignedIn, isAdmin, userProfile]);


    return (
        <header className="bg-[#30506C] text-white sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Site Title */}
                    <Link to="/" className="flex items-center space-x-2">
                        <img 
                            src="/logo.jpg" 
                            alt="ADHD Support UK Logo" 
                            className="h-10 w-10 object-contain rounded-md" 
                        />
                        <span className="text-xl text-white font-semibold tracking-wide">ADHD Support UK</span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {primaryNavLinks.map(link => (
                            <Link key={link.to} to={link.to} className="hover:text-[#469CA4] text-white transition font-medium">
                                {link.name}
                            </Link>
                        ))}
                        
                        {/* Authenticated Links: Only render if signed in AND profile loaded */}
                        <SignedIn>
                            {/* Wait for profile data to load before rendering conditional links */}
                            {!isProfileLoading && (
                                <>
                                    {authLinks.map(link => (
                                        <Link key={link.to} to={link.to} className="hover:text-[#469CA4] text-white transition font-medium">
                                            {link.name}
                                        </Link>
                                    ))}
                                    {/* Admin Link (Conditional) */}
                                    {isAdmin && (
                                        <Link to="/admin" className="hover:text-[#469CA4] text-white transition font-medium flex items-center space-x-1">
                                            <Settings size={16} /> <span>Admin</span>
                                        </Link>
                                    )}
                                </>
                            )}
                        </SignedIn>
                    </nav>

                    {/* Desktop Utility (Sign In/User Button) */}
                    <div className="hidden md:flex items-center space-x-4">
                        <SignedOut>
                            <Link
                                to="/sign-in"
                                className="px-4 py-2 rounded-lg hover:bg-[#469CA4] transition text-sm font-semibold text-white"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/sign-up"
                                className="px-4 py-2 rounded-lg bg-[#469CA4] hover:bg-[#3a7d84] transition text-sm font-semibold text-white"
                            >
                                Sign Up
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle navigation"
                    >
                        {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#263A47] border-t border-[#469CA4] absolute w-full shadow-xl">
                    <nav className="px-4 py-4 space-y-3">
                        {/* Render ALL links calculated in the allLinks array */}
                        {allLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="block text-white hover:text-[#469CA4] transition text-base font-medium"
                                onClick={closeMobileMenu}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Mobile Auth Buttons */}
                        <SignedOut>
                            <div className="pt-4 space-y-2 border-t border-gray-700">
                                <Link
                                    to="/sign-in"
                                    className="block text-center w-full px-4 py-2 rounded-lg hover:bg-[#469CA4] transition text-sm font-semibold border border-[#469CA4] text-white"
                                    onClick={closeMobileMenu}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/sign-up"
                                    className="block text-center w-full px-4 py-2 rounded-lg bg-[#469CA4] hover:bg-[#3a7d84] transition text-sm font-semibold text-white"
                                    onClick={closeMobileMenu}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </SignedOut>
                        <SignedIn>
                            <div className="pt-4 border-t border-gray-700">
                                <span className="block text-sm text-gray-400 mb-2">Account:</span>
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </SignedIn>
                    </nav>
                </div>
            )}
        </header>
    );
}