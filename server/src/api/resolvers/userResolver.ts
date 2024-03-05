import { Review, User, Comment, Offer, UserInput } from "../../types/DBtypes";
import fetchData from "../../functions/fetchData";
import { UserResponse, LoginResponse } from "../../types/MessageTypes";
import MyContext from "../../types/MyContext";
import {isLoggedIn, isAdmin} from "../../functions/authorize";

export default {
  //TÄNNE TULEE MYÖS COMMENT JA OFFER MERGEN JÄLKEEN!!!
  Review: {
    author: async (parent: Review) => {
      return await fetchData<User>(
        `${process.env.AUTH_URL}/users/${parent.author}`,
      );
    },
  },
  Query: {
    users: async () => {
      return await fetchData<User[]>(`${process.env.AUTH_URL}/users`);
    },
    userById: async (_parent: undefined, args: {id: string}) => {
      return await fetchData<User>(
        `${process.env.AUTH_URL}/users/${args.id}`,
      );
    },
    checkToken: async (
      _parent: undefined,
      _args: undefined,
      context: MyContext,
    ) => {
      return {message: 'User data: ', user: context.userdata?.user};
    },
  },
  Mutation: {
    login: async (
      _parent: undefined,
      args: {credentials: {username: string; password: string}},
    ) => {
      return await fetchData<LoginResponse>(
        `${process.env.AUTH_URL}/auth/login`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(args.credentials),
        },
      );
    },
    register: async (
      _parent: undefined,
      args: {user: UserInput},
    ) => {
      return await fetchData<UserResponse>(`${process.env.AUTH_URL}/users`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(args.user),
      });
    },
    updateUser: async (
      _parent: undefined,
      args: {user: Partial<UserInput>},
      context: MyContext,
    ) => {
      isLoggedIn(context);
      return await fetchData<UserResponse>(`${process.env.AUTH_URL}/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${context.userdata?.token}`,
        },
        body: JSON.stringify(args.user),
      });
    },
    deleteUser: async (
      _parent: undefined,
      _args: undefined,
      context: MyContext,
    ) => {
      isLoggedIn(context);
      return await fetchData<UserResponse>(`${process.env.AUTH_URL}/users`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${context.userdata?.token}`,
        },
      });
    },
    updateUserAsAdmin: async (
      _parent: undefined,
      args: {user: Partial<UserInput>, id: string},
      context: MyContext,
    ) => {
      isLoggedIn(context);
      isAdmin(context);
      return await fetchData<UserResponse>(
        `${process.env.AUTH_URL}/users/${args.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.userdata?.token}`,
          },
          body: JSON.stringify(args.user),
        },
      );
    },
    deleteUserAsAdmin: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ) => {
      isLoggedIn(context);
      isAdmin(context);
      return await fetchData<UserResponse>(
        `${process.env.AUTH_URL}/users/${args.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.userdata?.token}`,
          },
        },
      );
    },
  }
}