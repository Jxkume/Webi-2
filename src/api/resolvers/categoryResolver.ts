import { Review } from "../../types/DBtypes";
import MyContext from "../../types/MyContext";
import { isAdmin } from "../../functions/authorize";
import CategoryModel from "../models/categoryModel";
import ReviewModel from "../models/reviewModel";

export default {
  Review: {
    category: async (parent: Review) => {
      return await CategoryModel.findById(parent.category);
    },
  },
  Query: {
    categories: async () => {
      return await CategoryModel.find();
    },
  },
  Mutation: {
    createCategory: async (
      _parent: undefined,
      args: {name: string},
      context: MyContext
    ) => {
      isAdmin(context);
      return await CategoryModel.create(args);
    },
    deleteCategory: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext
    ) => {
      isAdmin(context);
      await ReviewModel.deleteMany({category: args.id});
      return await CategoryModel.findByIdAndDelete(args.id);
    },
    updateCategory: async (
      _parent: undefined,
      args: {id: string, name: string},
      context: MyContext
    ) => {
      isAdmin(context);
      return await CategoryModel.findByIdAndUpdate(
        args.id,
        {name: args.name},
        {new: true}
      );
    },
  },
};
