type User = {
  id: string;
  email: string;
  username: string;
}

type UserInput = {
  email?: string;
  username?: string;
  password?: string;
}

export type {User, UserInput};
