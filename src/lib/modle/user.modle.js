import mongoose from 'mongoose';
//https://chatgpt.com/share/6825c267-6960-8007-ac58-bbd4addce255

const userSchema = new mongoose.Schema(
    //blueprint of what a user looks like in your database
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    followers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      //This means the field is an array of MongoDB ObjectIds.
      //Each ObjectId in the array represents another User in the database.
      //ref: 'User' tells Mongoose: "this IDs points to there relevent document in the User collection" — so you can later populate it with full user info.
      default: [],
    },
    following: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
  },
  { timestamps: true }
  //timestamps: true adds createdAt and updatedAt fields automatically.
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
