"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import { Play, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function MediaCarousel({ media, onMediaClick, className = "" }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!media || media.length === 0) return null;

  const getDocumentIcon = (fileName) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FileText className="h-6 w-6 text-red-600" />;
      case "doc":
      case "docx":
        return <FileText className="h-6 w-6 text-blue-600" />;
      case "xls":
      case "xlsx":
        return <FileText className="h-6 w-6 text-green-600" />;
      case "ppt":
      case "pptx":
        return <FileText className="h-6 w-6 text-orange-600" />;
      case "txt":
        return <FileText className="h-6 w-6 text-gray-600" />;
      default:
        return <FileText className="h-6 w-6 text-blue-600" />;
    }
  };

  // If only one media item, render without swiper
  if (media.length === 1) {
    const item = media[0];
    return (
      <div className={`rounded-lg overflow-hidden ${className}`}>
        {item.type === "image" && (
          <img
            src={item.url}
            alt={item.name}
            className="w-full max-h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => onMediaClick?.(item)}
          />
        )}
        {item.type === "video" && (
          <div className="relative">
            <video
              src={item.url}
              className="w-full max-h-96 object-cover cursor-pointer"
              controls
              poster=""
              onClick={() => onMediaClick?.(item)}
            />
          </div>
        )}
        {item.type === "document" && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  {getDocumentIcon(item.name)}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500">Document</p>
                  {item.size && (
                    <p className="text-xs text-gray-400">
                      {(item.size / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onMediaClick?.(item)}
                  className="flex items-center space-x-1"
                >
                  <FileText className="h-4 w-4" />
                  <span>Preview</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Multiple media items - use swiper
  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          prevEl: `.swiper-button-prev-${media[0].id || "default"}`,
          nextEl: `.swiper-button-next-${media[0].id || "default"}`,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
        className="media-carousel"
        style={{
          "--swiper-navigation-color": "#ffffff",
          "--swiper-navigation-size": "20px",
          "--swiper-pagination-color": "#3b82f6",
          "--swiper-pagination-bullet-inactive-color": "#ffffff",
          "--swiper-pagination-bullet-inactive-opacity": "0.5",
        }}
      >
        {media.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="relative">
              {item.type === "image" && (
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full max-h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => onMediaClick?.(item)}
                />
              )}
              {item.type === "video" && (
                <div className="relative">
                  <video
                    src={item.url}
                    className="w-full max-h-96 object-cover cursor-pointer"
                    controls
                    poster=""
                    onClick={() => onMediaClick?.(item)}
                  />
                  <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    <Play className="h-3 w-3 inline mr-1" />
                    Video
                  </div>
                </div>
              )}
              {item.type === "document" && (
                <div className="bg-gray-50 border border-gray-200 p-4 min-h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      {getDocumentIcon(item.name)}
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500 mb-4">Document</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMediaClick?.(item)}
                      className="flex items-center space-x-1"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Preview</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <div
          className={`swiper-button-prev-${
            media[0].id || "default"
          } absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 cursor-pointer transition-all`}
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </div>
        <div
          className={`swiper-button-next-${
            media[0].id || "default"
          } absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 cursor-pointer transition-all`}
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </div>

        {/* Media Counter */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs z-10">
          {currentSlide + 1} / {media.length}
        </div>
      </Swiper>

      {/* Custom Styles */}
      <style jsx global>{`
        .media-carousel .swiper-pagination {
          bottom: 10px !important;
        }
        .media-carousel .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5) !important;
          border: 2px solid rgba(255, 255, 255, 0.8) !important;
        }
        .media-carousel .swiper-pagination-bullet-active {
          background: #3b82f6 !important;
          border-color: #3b82f6 !important;
        }
        .media-carousel .swiper-button-disabled {
          opacity: 0.3 !important;
        }
      `}</style>
    </div>
  );
}
