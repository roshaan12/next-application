import mongoose from "mongoose";



export const connect = async () => {
    console.log("connection progress");
    try {
        await mongoose.connect(process.env.MONGODB_URL!)
        console.log("connection successful");
    }
    catch (err) {
        console.log(err);

    }
}

