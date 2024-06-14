const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { 
    type: String, 
    unique: true, 
    required: true, 
    trim: true
  },
  email: { 
    type: String, 
    unique: true, 
    required: true, 
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  },
  thoughts: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Thought'
  }],
  friends: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }]
}, { 
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true }
});

// Indexes to improve performance
userSchema.index({ username: 1 });  // Index on username for quick look-up
userSchema.index({ email: 1 });     // Index on email for quick look-up

userSchema.virtual('friendCount').get(function() {
  // Check if this.friends exists and is an array
  if (this.friends && Array.isArray(this.friends)) {
    return this.friends.length;
  } else {
    return 0; // Return 0 if this.friends is not defined or not an array
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;