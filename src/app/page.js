"use client";
import { useAuth } from "@/context/AuthContext";
import { PostFeed } from "@/components/PostFeed";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Users,
  MessageSquare,
  TrendingUp,
  Briefcase,
  ChevronDown,
  Network,
  Target,
  Zap,
  Globe,
} from "lucide-react";

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  useEffect(() => {
    if (!isInView) return;

    // Parse the numeric value from strings like "1M+", "50K+", etc.
    const numericValue = parseFloat(value.replace(/[^\d.]/g, ""));
    const multiplier = value.includes("M")
      ? 1000000
      : value.includes("K")
      ? 1000
      : 1;
    const targetValue = numericValue * multiplier;

    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(targetValue * easeOutQuart);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  // Format the displayed number
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K";
    }
    return num.toString();
  };

  return (
    <span ref={ref}>
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative overflow-hidden ">
          <div className="inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
            <div className="container mx-auto px-4 pt-20 pb-32  max-w-7xl">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <motion.h1
                      className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                    >
                      Welcome to your professional network
                    </motion.h1>
                    <motion.p
                      className="text-xl text-gray-600 leading-relaxed max-w-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                    >
                      Connect with industry leaders, share your expertise, and
                      discover opportunities that shape your career journey.
                    </motion.p>
                  </div>

                  <motion.div
                    className="flex flex-col sm:flex-row gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-bl from-[#f7f5b2] via-[#bad4f9] to-[#5e89ef] px-8 py-4 text-lg text-gray-600 hover:from-[#f5f3a8] hover:via-[#a8d0f7] hover:to-[#4a7ce8] cursor-pointer"
                    >
                      <Link href="/auth/register">
                        <span className="font-semibold">
                          Join now - it&apos;s free
                        </span>
                      </Link>
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform font-semibold" />
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 py-4 text-lg text-gray-900 border-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <Link href="/auth/login">
                        <span className="font-semibold">Sign in</span>
                      </Link>
                    </Button>
                  </motion.div>

                  <div
                    className="flex items-center gap-6 text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>1M+ professionals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>50K+ companies</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="relative"
                >
                  <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Professional Network
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Connect with industry experts
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Share Insights
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Post updates and engage
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Grow Your Career
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Discover new opportunities
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 h-24 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20"></div>
                  <div className="absolute -bottom-4 -left-4 h-16 w-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-full opacity-20"></div>
                </motion.div>
              </div>
            </div>
          </div>

          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown className="h-6 w-6 text-gray-400" />
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4  max-w-7xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Join millions of professionals
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover why professionals choose our platform to build
                meaningful connections and advance their careers.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Network,
                  title: "Build Your Network",
                  description:
                    "Connect with like-minded professionals and industry leaders worldwide",
                  color: "from-blue-600 to-blue-700",
                },
                {
                  icon: Target,
                  title: "Targeted Opportunities",
                  description:
                    "Discover personalized job opportunities and career advancement paths",
                  color: "from-green-600 to-green-700",
                },
                {
                  icon: Zap,
                  title: "Instant Insights",
                  description:
                    "Share your expertise and stay updated with industry trends",
                  color: "from-purple-600 to-purple-700",
                },
                {
                  icon: Globe,
                  title: "Global Reach",
                  description:
                    "Connect with professionals from companies around the world",
                  color: "from-orange-600 to-orange-700",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:transform group-hover:scale-105 border border-gray-100">
                    <div
                      className={`h-12 w-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section with Animated Counters */}
        <section className="py-24 bg-gradient-to-r from-[#eeeeee] via-[#efefef] to-[#b4b4b4]">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-black">
              {[
                { number: "1M+", label: "Active Users", duration: 2.5 },
                { number: "50K+", label: "Companies", duration: 2.0 },
                { number: "100K+", label: "Daily Posts", duration: 2.8 },
                { number: "5M+", label: "Connections Made", duration: 3.0 },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <motion.div
                    className="text-4xl lg:text-5xl font-bold mb-2 text-gray-900 bg-clip-text"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <AnimatedCounter
                      value={stat.number}
                      duration={stat.duration}
                      suffix={stat.number.includes("+") ? "+" : ""}
                    />
                  </motion.div>
                  <motion.div
                    className="text-gray-600 font-medium"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    {stat.label}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 text-center  max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Ready to shape your professional story?
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join thousands of professionals who are already building their
                network and advancing their careers on our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="group bg-gradient-to-bl from-[#f7f5b2] via-[#bad4f9] to-[#5e89ef] px-8 py-4 text-lg text-gray-600"
                  >
                    Get started today
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg border-2 text-gray-900 hover:bg-gray-50"
                  >
                    Already have an account?
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer - only on homepage */}
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* Left Sidebar - Hidden on mobile and tablet, visible on large screens */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-6">
              <LeftSidebar />
            </div>
          </div>

          {/* Main Content - Full width on mobile/tablet, reduced width on large screens */}
          <div className="col-span-1 lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <PostFeed />
            </motion.div>
          </div>

          {/* Right Sidebar - Hidden on mobile and tablet, visible on large screens */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-6">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
