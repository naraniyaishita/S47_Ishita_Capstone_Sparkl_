import mongoose from "mongoose";

const googleSchema = new mongoose.Schema({

    googleId: {
        type: String,
        required: true
    },
    name : String,
    email : String,
    image : String
}, { timestamps: true });

const GoogleModal = mongoose.model("googles", googleSchema);

export default GoogleModal  