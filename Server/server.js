import express from "express";

const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to the server!');
})

app.listen(2004, () => {
    console.log('🚀 Server is running on port 2004 !!!');
});
