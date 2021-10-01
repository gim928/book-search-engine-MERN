//importing user and book models
const { User, Book } = require("../models");

const resolvers = {
  Query: {
    users: async () => {
      return await User.find({});
    },
  },
};

module.exports = resolvers;
