const mongoose = require('mongoose');
const { User, Thought } = require('../models');
const connectDB = require('../config/connection');

const users = [
  { username: 'Adrian', email: 'Adrian@gmail.com' },
  { username: 'Jaxon', email: 'Jaxon@aol.com' },
  { username: 'Sophia', email: 'Sophia@aol.com' },
  { username: 'Ismael', email: 'Ismael@gmail.com' }
];

const thoughts = [
  {
    thoughtText: "I have cool hair",
    username: 'Adrian',
    reactions: [
      { reactionBody: "you do have cool hair!", username: "Jaxon" },
      { reactionBody: "I love your hair", username: "Sophia" }
    ]
  },
  {
    thoughtText: "Adrians hair is cool",
    username: 'Jaxon',
    reactions: [
      { reactionBody: "Thank you!", username: "Adrian" }
    ]
  },
  {
    thoughtText: "I want to go outside",
    username: 'Sophia',
    reactions: [{ reactionBody: "Yes its beautiful outside", username: "Jaxon" }]
  },
  {
    thoughtText: "Sophia should go outside",
    username: 'Ismael',
    reactions: [{ reactionBody: "You're right I will", username: "Sophia"}]
  }
];

// Connect to MongoDB and run the seeding script
connectDB().then(() => {
  console.log("Connected to MongoDB, starting to seed...");
  runSeed();
}).catch(err => {
  console.error("Failed to connect to MongoDB", err);
});

async function runSeed() {
  try {
    console.log('Deleting existing users...');
    await User.deleteMany({});
    console.log('Deleting existing thoughts...');
    await Thought.deleteMany({});

    console.log('Inserting new users...');
    const createdUsers = await User.insertMany(users);
    console.log('Users inserted successfully.');

    console.log('Preparing thoughts...');
    const modifiedThoughts = thoughts.map((thought, index) => ({
      ...thought,
      userId: createdUsers[index % createdUsers.length]._id
    }));

    console.log('Inserting new thoughts...');
    await Thought.insertMany(modifiedThoughts);
    console.log('Thoughts inserted successfully.');

    console.log('Linking friends...');
    await Promise.all(createdUsers.map((user, index) => {
      let friendIds = createdUsers.filter((_, i) => i !== index).map(user => user._id);
      return User.findByIdAndUpdate(user._id, { $set: { friends: friendIds } });
    }));
    console.log('Friends linked successfully.');

    console.log('Database seeded! 🌱');
    process.exit(0);
  } catch (err) {
    console.error("Error seeding the database:", err);
    process.exit(1);
  }
}