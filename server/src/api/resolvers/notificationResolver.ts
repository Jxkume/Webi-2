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
      args.input.expire = new Date();
      args.input.expire.setDate(args.input.expire.getDate() + 14);
      console.log(args.input);
      return await notificationModel.create(args.input);
    },
    sendNotificationToManyUsers: async(
      _parent: undefined,
      args: {userIds: string[], text: string},
    ) => {
      const publicationDate = new Date();
      const expire = new Date();
      expire.setDate(expire.getDate() + 14);
      const notifications = args.userIds.map((userId) => {
        return {
          receiver: userId,
          text: args.text,
          publicationDate: publicationDate,
          expire: expire,
        }
      });
      return await notificationModel.insertMany(notifications);
    },
    deleteNotification: async(
      _parent: undefined,
      args: {id: string},
      context: MyContext
    ) => {
      isLoggedIn(context);
      return await notificationModel.findByIdAndDelete(args.id);
    }
  }
}
