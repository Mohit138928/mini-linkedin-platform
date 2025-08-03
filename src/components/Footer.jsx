"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Linkedin,
  Twitter,
  Github,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Heart,
  Users,
  MessageSquare,
  Briefcase,
  TrendingUp,
} from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about" },
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Community",
      links: [
        { name: "Network", href: "/network" },
        { name: "Groups", href: "/groups" },
        { name: "Events", href: "/events" },
        { name: "Jobs", href: "/jobs" },
        { name: "Learning", href: "/learning" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Blog", href: "/blog" },
        { name: "API Docs", href: "/api" },
        { name: "Developer", href: "/developer" },
        { name: "Partners", href: "/partners" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Security", href: "/security" },
        { name: "Accessibility", href: "/accessibility" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Mail, href: "mailto:contact@minilinkedin.com", label: "Email" },
  ];

  const stats = [
    { icon: Users, value: "1M+", label: "Active Members" },
    { icon: MessageSquare, value: "100K+", label: "Daily Posts" },
    { icon: Briefcase, value: "50K+", label: "Companies" },
    { icon: TrendingUp, value: "5M+", label: "Connections" },
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 ">

        {/* Links Section */}
        <div className="container mx-auto px-4 py-16  max-w-7xl">
          <div className="grid lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Link href="/" className="inline-block">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-gradient-to-bl from-[#f7f5b2] via-[#bad4f9] to-[#5e89ef] rounded-lg p-2">
                      <Users className="h-8 w-8 text-black" />
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      Mini LinkedIn
                    </span>
                  </div>
                </Link>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Building the future of professional networking. Connect,
                  share, and grow with our vibrant community of professionals
                  worldwide.
                </p>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span>contact@minilinkedin.com</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span>+91 99999 00000</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>Delhi, India</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      className="bg-gray-800 hover:bg-gradient-to-bl from-[#f7f5b2] via-[#bad4f9] to-[#5e89ef] rounded-lg p-3 transition-all duration-300 group"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: sectionIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-6 text-white">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>


        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-gray-400 text-sm flex items-center mb-4 md:mb-0"
              >
                <span>© 2025 Mini LinkedIn.</span>
              </motion.div>

              <motion.button
                onClick={scrollToTop}
                className="bg-gradient-to-bl from-[#f7f5b2] via-[#bad4f9] to-[#5e89ef] rounded-full p-3 transition-all duration-200 hover:scale-110"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Scroll to top"
              >
                <ArrowUp className="h-5 w-5 text-black" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
