import mongoose from "mongoose";
//https://chatgpt.com/share/6825c267-6960-8007-ac58-bbd4addce255

let initialized = false;

export async function connect() {
    //Makes Mongoose only return results that exactly match the query fields. (Helps avoid unexpected behavior.)
    mongoose.set('strictQuery' , true)
    
    if (initialized) {
        console.log("Already connected to MongoDb")
        return;
    };
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName : 'X-twitter-clone',
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useNewUrlParser & useUnifiedTopology: These options help ensure modern and stable MongoDB connection behavior.
        });
        console.log('Connected to MongoDB');
        initialized = true;
    } catch (error) {
    console.log('Error connecting to MongoDB:', error);
  }
}