"use client";
import { motion } from "framer-motion";
import {
  Loader2,
  Users,
  MessageSquare,
  TrendingUp,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export function LoadingSpinner({
  size = "md",
  variant = "default",
  message,
  className = "",
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const messageSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const defaultSpinner = (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-gray-200 border-t-blue-600 rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );

  const dotsSpinner = (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${
            size === "sm" ? "w-1 h-1" : size === "lg" ? "w-3 h-3" : "w-2 h-2"
          } bg-blue-600 rounded-full`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );

  const pulseSpinner = (
    <motion.div
      className={`${sizeClasses[size]} bg-blue-600 rounded-full ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );

  const iconSpinner = (
    <motion.div
      className={`${sizeClasses[size]} text-blue-600 ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <RefreshCw className="w-full h-full" />
    </motion.div>
  );

  const bounceSpinner = (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${
            size === "sm" ? "w-2 h-2" : size === "lg" ? "w-4 h-4" : "w-3 h-3"
          } bg-blue-600 rounded-full`}
          animate={{
            y: ["0%", "-50%", "0%"],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  );

  const getSpinner = () => {
    switch (variant) {
      case "dots":
        return dotsSpinner;
      case "pulse":
        return pulseSpinner;
      case "icon":
        return iconSpinner;
      case "bounce":
        return bounceSpinner;
      default:
        return defaultSpinner;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {getSpinner()}
      {message && (
        <motion.p
          className={`text-gray-600 ${messageSize[size]} text-center`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}

export function InlineLoader({
  message = "Loading...",
  size = "sm",
  variant = "dots",
}) {
  return (
    <div className="flex items-center space-x-2 text-gray-600">
      <LoadingSpinner size={size} variant={variant} />
      <span className="text-sm">{message}</span>
    </div>
  );
}

export function ButtonLoader({
  children,
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      className={`relative ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" variant="default" />
        </div>
      )}
      <div className={loading ? "opacity-0" : "opacity-100"}>{children}</div>
    </button>
  );
}

export function ContentLoader({ lines = 3, avatar = false, className = "" }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="flex items-start space-x-4">
        {avatar && (
          <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
        )}
        <div className="flex-1 space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={`h-4 bg-gray-200 rounded ${
                index === lines - 1 ? "w-3/4" : "w-full"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CardLoader({ className = "" }) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-sm p-4 animate-pulse ${className}`}
    >
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
      <div className="h-32 bg-gray-200 rounded mb-4" />
      <div className="flex space-x-4">
        <div className="h-8 bg-gray-200 rounded flex-1" />
        <div className="h-8 bg-gray-200 rounded flex-1" />
        <div className="h-8 bg-gray-200 rounded flex-1" />
      </div>
    </div>
  );
}

export function GridLoader({
  items = 6,
  columns = "md:grid-cols-2 lg:grid-cols-3",
  className = "",
}) {
  return (
    <div className={`grid grid-cols-1 ${columns} gap-6 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <CardLoader key={index} />
      ))}
    </div>
  );
}
