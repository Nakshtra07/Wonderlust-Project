const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const URL = 'mongodb://127.0.0.1:27017/wonderlust';
main()
    .then(() => {
        console.log("connection is successfull");
    })
    .catch((err) => {
        console.log("There is an error");
    })

async function main() {
    await mongoose.connect(URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "68b996fa4c5641adf08fe6d2" }));
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
}

initDB();