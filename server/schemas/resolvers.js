//importing user and book models
const { User, Book } = require("../models");

const { AuthenticationError } = require("apollo-server-express");

const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError(
        "Please log in to use the book search engine"
      );
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError(
          "Incorrect credentials, please try again"
        );
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      if (context.user) {
        console.log(context.user);
        console.log(args);
        const updatedUser = await User.findByIdAndUpdate(
          { _id: contex.user._id },
          { $addToSet: { savedBooks: args.input } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("please log in!");
    },
    removeBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findByOneAndUpdate(
          { _id: context.user_id },
          { $pull: { savedBooks: { bookId: args.boodId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("please log in!");
    },
  },
};

module.exports = resolvers;
