import { Review } from "../../types/DBtypes";
import reviewModel from "../models/reviewModel";
import MyContext from "../../types/MyContext";
import { isLoggedIn } from "../../functions/authorize";
import commentModel from "../models/commentModel";

export default {
  Query: {
    reviews: async () => {
      return await reviewModel.find();
    },
    review: async (_parent: undefined, args: { id: string }) => {
      return await reviewModel.findById(args.id);
    },
    reviewsByCategory: async (
      _parent: undefined,
      args: { categoryId: string }
    ) => {
      return await reviewModel.find({ category: args.categoryId });
    },
    reviewsByAuthor: async (_parent: undefined, args: { authorId: string }) => {
      return await reviewModel.find({ author: args.authorId });
    },
    reviewsByRating: async (_parent: undefined, args: { rating: number }) => {
      return await reviewModel.find({ rating: args.rating });
    },
  },
  Review: {
    comments: async (parent: any) => {
      return await commentModel.find({ post: parent.id });
    },
  },

  Mutation: {
    addReview: async (
      _parent: undefined,
      args: { input: Omit<Review, "id"> },
      context: MyContext
    ) => {
      isLoggedIn(context);
      args.input.author = context.userdata?.user.id;
      args.input.publicationDate = new Date();
      return await reviewModel.create(args.input);
    },
    updateReview: async (
      _parent: undefined,
      args: { id: string; input: Partial<Omit<Review, "id">> },
      context: MyContext
    ) => {
      isLoggedIn(context);
      if (context.userdata?.user.role !== "admin") {
        const filter = { _id: args.id, author: context.userdata?.user.id };
        return await reviewModel.findOneAndUpdate(filter, args.input, {
          new: true,
        });
      } else {
        return await reviewModel.findByIdAndUpdate(args.id, args.input, {
          new: true,
        });
      }
    },
    deleteReview: async (
      _parent: undefined,
      args: { id: string },
      context: MyContext
    ) => {
      isLoggedIn(context);
      if (context.userdata?.user.role !== "admin") {
        const filter = { _id: args.id, author: context.userdata?.user.id };
        return await reviewModel.findOneAndDelete(filter);
      } else {
        return await reviewModel.findByIdAndDelete(args.id);
      }
    },
  },
};
