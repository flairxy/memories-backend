import PostMessage from "../models/postMessage.js";
import mongoose from "mongoose";

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();
    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const createPosts = async (req, res) => {
  const post = req.body;
  const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString()});
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id.");
  try {
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true,
    });
    res.status(201).json(updatedPost);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id.");
  try {
    await PostMessage.findByIdAndRemove(id);
    res.status(201).json({ message: "Post deleted successfully!" });
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

export const likePost = async (req, res) => {
  if (!req.userId) return res.json({ message: "Unauthenticated" });

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id.");

  try {
    const post = await PostMessage.findById(id);
    const index = post.likes.findIndex((id) => id === String(req.userId)); //returns -1 if the index is not found

    if (index === -1) {
      // allows the user to like
      post.likes.push(req.userId);
    } else {
      // removes the like from post
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
      new: true,
    });
    res.status(201).json(updatedPost);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};
