import  mongoose   from "mongoose";
import { Schema } from "mongoose";

const bookSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: String,
    coverImageURL: String,
    genres: Array,
    wantTo: {
        type: String,
        enum: ["read", "already", "reading"],
        default: "read"
    },
    fav: {
        type: Boolean,
        default: false
    }
});

const BookModal = mongoose.model("books", bookSchema);

export default BookModal    