import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {

    const { page, limit } = req.query;

    try {
        const defaultPageLimit = 3;
        const Limit = (Number(limit)? Number(limit): defaultPageLimit);
        const Page = (Number(page)>0? Number(page) : 1);
        const StartIndex = (Page - 1) * Limit;
        const TotalPosts = await PostMessage.countDocuments({});

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(Limit).skip(StartIndex);

        res.status(200).json({ data: posts, currentPage: Page, numberOfPages: Math.ceil(TotalPosts/Limit) });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const getPostsBySearch = async (req, res) => {

    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, 'i');
        const posts = await PostMessage.find({ $or: [ {title}, {tags: { $in: tags.split(',') }} ] });
        res.status(200).json({ data: posts });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString()});
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

        const updatedPost = await PostMessage.findByIdAndUpdate(_id,{...post, createdAt: new Date().toISOString()}, {new: true});

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

        // Checking if the user is authenticated, if he is then the middleware must have given the request a userId. if not then he is not authenticated.
        if(!req.userId)
            return res.status(400).json({ message: 'Unauthenticated, Access denied.' });

        // If he is authenticated then we check if the post id is a valid post or not.
        if(!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send(`No post with id: ${_id}`);

        // We then find the post with the request post id in the data base and load it into post variable.
        const post = await PostMessage.findById(id);

        // Likes is an array of strings that we have maintained for each post, it contains the userId who have liked the post.
        // In the index variable we are trying to find if the requested user's id is present in that particular likes array or not if it is not existing already in the likes array then the variable index will have -1 value, if it is there in the likes array then index will have non negative value.

        const index = post.likes.findIndex((id) => id === String(req.userId));

        if(index === -1)
        {
            // If the user has not liked the post previously.
            post.likes.push(req.userId);
        }
        else
        {
            // if the userId exists in the likes list we need to remove his id from there.
            post.likes = post.likes.filter((id) => id !== String(req.userId));
        }

        const updatedPost = await PostMessage.findByIdAndUpdate(id, post , {new: true});
        
        res.json(updatedPost);

    } catch (error) {
        console.log(error);
    }
};
