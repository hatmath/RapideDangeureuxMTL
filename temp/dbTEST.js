const express = require("express");
const mongoose = require("mongoose");
//const Router = require("./routes")
const port = 4000;
const app = express();

app.use(express.json());

app.listen(
    port, 
    ()=> console.log(`Live on port ${port}`)
);
app.get('/', () => {
    mongoConnection()
})

function mongoConnection() {

    mongoose.connect('mongodb://127.0.0.1:27017/local');

    const db = mongoose.connection;
    
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
    console.log("Connected successfully");
    });
}
