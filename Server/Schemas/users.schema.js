import  mongoose   from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    ,
    blogPosts: {
        type: Array,
    },
    readingList : {
        type: Array
    },
    watchList : {
        type: Array
    }

}

   
})

const UserModal = mongoose.model("users", userSchema);

export default UserModal    