import express from 'express';
import { getPosts, createPost, updatePost, deletePost, likePost, dislikePost } from '../controllers/posts.js';

const router = express.Router();

router.get('/', getPosts );
router.post('/', createPost );
router.patch('/:id', updatePost);
router.delete('/:id',deletePost);
router.patch('/:id/likePost', likePost);
router.patch('/:id/dislikePost', dislikePost);

export default router;