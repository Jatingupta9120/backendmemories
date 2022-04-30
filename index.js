import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// Importing Router
import postRoutes from './routes/posts.js';

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit:"30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit:"30mb", extended: true }));
app.use(cors());

app.use('/posts', postRoutes);

app.get('/', (req, res) => {
        res.send('Welcome to Memories API: Created by Aman Singh Bhogal');
});

// Connecting to MongoDB
// Details of Cluster:
// Cluster Name: memories-db

const PORT = process.env.PORT || 5000;

// Using Mongoose to Connect to the our Database
mongoose.connect(process.env.CONNECTION__URL, { useNewURLParser: true, useUnifiedTopology: true })
        .then(() => app.listen(PORT, () => console.log(`Server Running Successfully on port: ${PORT}`)) )
        .catch((error) => console.log(error.message));

// mongoose.set('useFindAndModify',false);