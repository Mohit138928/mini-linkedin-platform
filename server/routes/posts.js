const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { v4: uuidv4 } = require("uuid");

// Get all posts or posts by user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { authorId: userId } : {};

    const posts = await Post.find(query).sort({ createdAt: -1 }).limit(50);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search posts by content
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    // console.log("Post search query:", q); // Debug log

    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const searchQuery = q.trim();
    // console.log("Searching for posts with content containing:", searchQuery);

    // Search posts by content (case-insensitive)
    const posts = await Post.find({
      content: { $regex: searchQuery, $options: "i" },
    })
      .sort({ timestamp: -1 })
      .limit(10);

    // console.log(`Found ${posts.length} posts`);
    res.json(posts);
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({ message: "Failed to search posts" });
  }
});

// Get single post by postId
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({ postId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Failed to fetch post" });
  }
});

// Create a new post
router.post("/", async (req, res) => {
  try {
    const { content, authorId, authorName, media } = req.body;

    if (!content || !authorId || !authorName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Generate unique postId
    const postId = uuidv4();

    const post = new Post({
      content,
      authorId,
      authorName,
      postId,
      media: media || [],
      likes: [],
      comments: [],
      shares: [],
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Like/Unlike post
router.post("/:postId/like", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, userName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({ message: "Missing user information" });
    }

    const post = await Post.findOne({ postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user already liked the post
    const existingLikeIndex = post.likes.findIndex(
      (like) => like.userId === userId
    );

    if (existingLikeIndex > -1) {
      // Unlike the post
      post.likes.splice(existingLikeIndex, 1);
      post.likeCount = Math.max(0, post.likeCount - 1);
    } else {
      // Like the post
      post.likes.push({
        userId,
        userName,
        timestamp: new Date(),
      });
      post.likeCount += 1;
    }

    await post.save();
    res.json({
      liked: existingLikeIndex === -1,
      likeCount: post.likeCount,
      likes: post.likes,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Failed to toggle like" });
  }
});

// Add comment to post
router.post("/:postId/comment", async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, authorId, authorName, authorAvatar } = req.body;

    if (!content || !authorId || !authorName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const post = await Post.findOne({ postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      content,
      authorId,
      authorName,
      authorAvatar,
    };

    post.comments.push(newComment);
    post.commentCount += 1;
    await post.save();

    // Return the newly added comment with its ID
    const addedComment = post.comments[post.comments.length - 1];
    res.status(201).json({
      comment: addedComment,
      commentCount: post.commentCount,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
});

// Delete comment
router.delete("/:postId/comment/:commentId", async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req.body;

    const post = await Post.findOne({ postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user owns the comment or the post
    const comment = post.comments[commentIndex];
    if (comment.authorId !== userId && post.authorId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    post.comments.splice(commentIndex, 1);
    post.commentCount = Math.max(0, post.commentCount - 1);
    await post.save();

    res.json({ commentCount: post.commentCount });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
});

// Share post
router.post("/:postId/share", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, userName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({ message: "Missing user information" });
    }

    const post = await Post.findOne({ postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user already shared the post
    const existingShareIndex = post.shares.findIndex(
      (share) => share.userId === userId
    );

    if (existingShareIndex === -1) {
      // Add share
      post.shares.push({
        userId,
        userName,
        timestamp: new Date(),
      });
      post.shareCount += 1;
      await post.save();
    }

    // Generate shareable URL
    const shareUrl = `${req.protocol}://${req.get("host")}/post/${postId}`;

    res.json({
      shared: true,
      shareCount: post.shareCount,
      shareUrl,
    });
  } catch (error) {
    console.error("Error sharing post:", error);
    res.status(500).json({ message: "Failed to share post" });
  }
});

// Get post likes
router.get("/:postId/likes", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({ postId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post.likes);
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ message: "Failed to fetch likes" });
  }
});

// Get post comments
router.get("/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({ postId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post.comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

// Update/Edit a post
router.put("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, content } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const post = await Post.findOne({ postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user owns the post
    if (post.authorId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this post" });
    }

    post.content = content.trim();
    post.updatedAt = new Date();
    await post.save();

    res.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Failed to update post" });
  }
});

// Delete a post by postId
router.delete("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const post = await Post.findOne({ postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user owns the post
    if (post.authorId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Failed to delete post" });
  }
});

module.exports = router;
