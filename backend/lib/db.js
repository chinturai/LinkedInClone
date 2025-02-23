import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDb successfully connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.log('Error in connnecting to the Database...');
    }
}