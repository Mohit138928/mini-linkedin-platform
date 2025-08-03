"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Card, CardContent } from "@/components/Card";
import {
  ArrowLeft,
  Home,
  Search,
  Users,
  MessageSquare,
  Briefcase,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const suggestions = [
    {
      icon: Home,
      title: "Return to Homepage",
      description: "Go back to your feed and discover new content",
      href: "/",
      color: "from-blue-600 to-blue-700",
    },
    {
      icon: Users,
      title: "Explore Profiles",
      description: "Connect with professionals in your industry",
      href: "/feed",
      color: "from-green-600 to-green-700",
    },
    {
      icon: Search,
      title: "Search Content",
      description: "Find posts, people, and opportunities",
      href: "/feed",
      color: "from-purple-600 to-purple-700",
    },
    {
      icon: MessageSquare,
      title: "View Recent Posts",
      description: "Check out the latest updates from your network",
      href: "/feed",
      color: "from-orange-600 to-orange-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex items-center">
        <motion.div
          className="w-full max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Error Message */}
            <motion.div
              variants={itemVariants}
              className="text-center lg:text-left"
            >
              <motion.div
                className="inline-block mb-6"
                variants={floatingVariants}
                animate="animate"
              >
                <div className="text-8xl lg:text-9xl font-bold bg-gradient-to-bl from-[#f7f5b2] via-[#bad4f9] to-[#5e89ef] bg-clip-text text-transparent">
                  404
                </div>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
              >
                Oops! Page not found
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-600 mb-8 leading-relaxed max-w-md mx-auto lg:mx-0"
              >
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
                Let&apos;s get you back to building your professional network.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link href="/">
                  <Button
                    size="lg"
                    className="bg-gradient-to-bl from-[#f7f5b2] via-[#bad4f9] to-[#5e89ef] text-gray-600 font-semibold px-8 py-4"
                  >
                    <Home className="h-5 w-5 mr-2 font-semibold" />
                    Back to Home
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.history.back()}
                  className="px-8 py-4 border-2 text-gray-700 hover:bg-gray-50 font-semibold"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Go Back
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center lg:justify-start gap-6 mt-8 text-sm text-gray-500"
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>1M+ professionals</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>50K+ companies</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Suggestions */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="text-center lg:text-left mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  What would you like to do?
                </h2>
                <p className="text-gray-600">
                  Here are some suggestions to get you back on track
                </p>
              </div>

              <div className="grid gap-4">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href={suggestion.href}>
                      <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer border border-gray-200 hover:border-gray-300">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div
                              className={`h-12 w-12 bg-gradient-to-r ${suggestion.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                            >
                              <suggestion.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                {suggestion.title}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {suggestion.description}
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Additional Help */}
              <motion.div
                variants={itemVariants}
                className="mt-8 p-6 bg-white/50 rounded-xl border border-gray-200"
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <RefreshCw className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Still having trouble?
                    </h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Try refreshing the page or check if the URL is correct.
                      Our platform is constantly evolving to serve you better.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Page
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 right-20 opacity-20 hidden lg:block">
            <motion.div
              className="h-20 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="absolute bottom-20 left-20 opacity-20 hidden lg:block">
            <motion.div
              className="h-16 w-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-full"
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
