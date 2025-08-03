const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// Test endpoint - this should already exist
router.get("/test", (req, res) => {
  res.json({
    message: "Upload route is working!",
    cloudinaryConfigured: !!cloudinary.config().cloud_name,
    timestamp: new Date().toISOString()
  });
});

// Simple health check for upload router
router.get("/", (req, res) => {
  res.json({
    message: "Upload API is running",
    endpoints: {
      test: "/api/upload/test",
      general: "/api/upload (POST)",
      profilePicture: "/api/upload/profile-picture (POST)",
      postImage: "/api/upload/post-image (POST)"
    }
  });
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for general uploads
  },
  fileFilter: (req, file, cb) => {
    console.log("File filter - mimetype:", file.mimetype);
    // Allow images, videos, and documents
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/") ||
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "text/plain"
    ) {
      cb(null, true);
    } else {
      cb(new Error("File type not supported"), false);
    }
  },
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Maximum size is 5MB." });
    }
    return res
      .status(400)
      .json({ message: "File upload error: " + error.message });
  }
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

// General file upload endpoint
router.post("/", upload.single("file"), handleMulterError, async (req, res) => {
  try {
    console.log("General file upload endpoint hit");
    console.log("File received:", req.file ? "Yes" : "No");

    if (!req.file) {
      console.log("No file in request");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File details:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    let uploadOptions = {
      folder: "mini-linkedin/posts",
    };

    // Determine resource type and folder based on file type
    if (req.file.mimetype.startsWith("image/")) {
      uploadOptions.resource_type = "image";
      uploadOptions.folder = "mini-linkedin/post-images";
      uploadOptions.transformation = [
        { width: 1200, height: 630, crop: "limit" },
        { quality: "auto", fetch_format: "auto" },
      ];
    } else if (req.file.mimetype.startsWith("video/")) {
      uploadOptions.resource_type = "video";
      uploadOptions.folder = "mini-linkedin/post-videos";
      uploadOptions.transformation = [
        { width: 1280, height: 720, crop: "limit" },
        { quality: "auto" },
      ];
    } else {
      // For documents (PDF, DOC, etc.)
      uploadOptions.resource_type = "raw";
      uploadOptions.folder = "mini-linkedin/post-documents";
    }

    console.log("Starting Cloudinary upload with options:", uploadOptions);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) {
            console.error("Cloudinary error:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload successful:", result.secure_url);
            resolve(result);
          }
        })
        .end(req.file.buffer);
    });

    res.json({
      message: "File uploaded successfully",
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      fileName: req.file.originalname,
      fileSize: req.file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res
      .status(500)
      .json({ message: "Error uploading file", error: error.message });
  }
});

// Configure multer for profile pictures (images only)
const profileUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for profile pictures
  },
  fileFilter: (req, file, cb) => {
    console.log("Profile picture filter - mimetype:", file.mimetype);
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed for profile pictures"), false);
    }
  },
});

// Upload profile picture
router.post(
  "/profile-picture",
  profileUpload.single("profilePicture"),
  handleMulterError,
  async (req, res) => {
    try {
      console.log("Profile picture upload endpoint hit");
      console.log("File received:", req.file ? "Yes" : "No");

      if (!req.file) {
        console.log("No file in request");
        return res.status(400).json({ message: "No file uploaded" });
      }

      console.log("File details:", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });

      // Upload to Cloudinary
      console.log("Starting Cloudinary upload...");
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "mini-linkedin/profile-pictures",
              transformation: [
                { width: 400, height: 400, crop: "fill", gravity: "face" },
                { quality: "auto", fetch_format: "auto" },
              ],
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary error:", error);
                reject(error);
              } else {
                console.log("Cloudinary upload successful:", result.secure_url);
                resolve(result);
              }
            }
          )
          .end(req.file.buffer);
      });

      res.json({
        message: "Profile picture uploaded successfully",
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res
        .status(500)
        .json({ message: "Error uploading file", error: error.message });
    }
  }
);

// Upload post images
router.post(
  "/post-image",
  profileUpload.single("postImage"),
  handleMulterError,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "mini-linkedin/posts",
              transformation: [
                { width: 1200, height: 630, crop: "limit" },
                { quality: "auto", fetch_format: "auto" },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(req.file.buffer);
      });

      res.json({
        message: "Post image uploaded successfully",
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res
        .status(500)
        .json({ message: "Error uploading file", error: error.message });
    }
  }
);

module.exports = router;
