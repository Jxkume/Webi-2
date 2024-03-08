import { Notification } from "../../types/DBtypes";
import notificationModel from "../models/notificationModel";
import MyContext from "../../types/MyContext";
import { isLoggedIn } from "../../functions/authorize";
import { GraphQLError } from "graphql";

export default {
  Query: {
    notificationsByReceiver: async (
      _parent: undefined,
      args: {receiverId: string},
      context: MyContext
    ) => {
      isLoggedIn(context);
      if(context.userdata?.user.id !== args.receiverId) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHORIZED',
            http: {
              status: 401,
            },
          },
        });
      }
      return await notificationModel.find({receiver: args.receiverId});
    },
  },
  Mutation: {
    addNotification: async(
      _parent: undefined,
      args: {input: Omit<Notification, 'id'>},
    ) => {
      args.input.publicationDate = new Date();
      return await notificationModel.create(args.input);
    },
    deleteNotification: async(
      _parent: undefined,
      args: {id: string},
    ) => {
      return await notificationModel.findByIdAndDelete(args.id);
    }
  }
}
