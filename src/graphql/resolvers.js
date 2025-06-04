const User = require('../models/User');

const resolvers = {
  Query: {
    getUser: async (_, { id }) => await User.findById(id),
    allUsers: async () => await User.find(),
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      const user = new User({ name, email });
      return await user.save();
    },
  },
};

module.exports = { resolvers };
