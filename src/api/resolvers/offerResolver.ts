import offerModel from "../models/offerModel";
import { Offer } from "../../types/DBtypes";
import { MyContext } from "../../types/MyContext";
import { isAdmin, isLoggedIn } from "../../functions/authorize";

export default {
  Query: {
    offerById: async (_: any, args: { id: string }) => {
      try {
        return await offerModel.findById(args.id);
      } catch (error) {
        throw new Error("Failed to get offer by id");
      }
    },

    offers: async () => {
      try {
        return await offerModel.find();
      } catch (error) {
        throw new Error("Failed to get offers");
      }
    },
  },

  Mutation: {
    createOffer: async (
      _: any,
      args: { input: Omit<Offer, "id"> },
      context: MyContext
    ) => {
      try {
        isLoggedIn(context);
        args.input.author = context.userdata?.user.id;
        return await offerModel.create(args.input);
      } catch (error) {
        throw new Error("Failed to create offer");
      }
    },

    updateOffer: async (
      _: any,
      args: { id: String; input: Partial<Omit<Offer, "id">> },
      context: MyContext
    ) => {
      try {
        isLoggedIn(context);
        if (context.userdata?.user.role === "admin") {
          return await offerModel.findByIdAndUpdate(args.id, args.input, {
            new: true,
          });
        }
        const offer = await offerModel.findById(args.id);
        if (context.userdata?.user.id !== offer?.author.toString()) {
          throw new Error("Not authorized to update offer");
        }
        return await offerModel.findByIdAndUpdate(args.id, args.input, {
          new: true,
        });
      } catch (error) {
        throw new Error("Failed to update offer");
      }
    },

    deleteOffer: async (_: any, args: { id: string }, context: MyContext) => {
      try {
        isLoggedIn(context);
        if (context.userdata?.user.role === "admin") {
          return await offerModel.findByIdAndDelete(args.id);
        }
        const offer = await offerModel.findById(args.id);
        if (context.userdata?.user.id !== offer?.author.toString()) {
          throw new Error("Not authorized to delete offer");
        }
        return await offerModel.findByIdAndDelete(args.id);
      } catch (error) {
        throw new Error("Failed to delete offer");
      }
    },
  },
};
