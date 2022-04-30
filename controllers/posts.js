import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();
        console.log(postMessages);
        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage(post);
    try {
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const updatePost = async (req, res) => {
    const { id: _id }= req.params;
    const post = req.body;
    try {
        if(!mongoose.Types.ObjectId.isValid(_id))
            return res.status(404).send(`No post with id: ${_id}`);

        const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {new: true});

        res.json(updatedPost)
    } catch (error) {
        console.log(error);
    }
};

export const deletePost = async(req, res) => {
    const { id } = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send(`No post with id: ${id}`);
        
        await PostMessage.findByIdAndRemove(id);
        res.json( { message: `Post with id: ${id} is Deleted.`} );
        
    } catch (error) {
        console.log(error);
    }
};

export const likePost = async (req, res) => {
    const { id } = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send(`No post with id: ${_id}`);
        const post = await PostMessage.findById(id);
        const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1}, {new: true});
        
        res.json(updatedPost);

    } catch (error) {
        console.log(error);
    }
};
export const dislikePost = async (req, res) => {
    const { id } = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send(`No post with id: ${_id}`);
        const post = await PostMessage.findById(id);
        const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount - 1}, {new: true});
        
        res.json(updatedPost);

    } catch (error) {
        console.log(error);
    }
};