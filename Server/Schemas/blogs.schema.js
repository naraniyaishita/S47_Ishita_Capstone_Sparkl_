import mongoose from "mongoose";
import { Schema } from "mongoose";


const blogSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: String,
    images: [],
    tags: [String],
    createdDate: {
        type: Date,
        default: Date.now 
    },
    updatedDate: {
        type: Date,
        default: Date.now 
    }})

const BlogModal = mongoose.model("blogs", blogSchema);

export default BlogModal    