const mongoose = require("mongoose");

const connectDb = async () => {
   await mongoose.connect("mongodb+srv://tejapintu4:MGYzt1VZmrrZty9s@namastenode.nr7lh.mongodb.net/HelloWorld")
};
module.exports = {connectDb}



//mongodb+srv://tejapintu4:MGYzt1VZmrrZty9s@namastenode.nr7lh.mongodb.net/
