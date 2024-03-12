import { makeAutoObservable } from "mobx";
import { User, UserInput } from "../../Types/User";
import { getCookie } from "typescript-cookie";
import logout from "../../Functions/Logout";
import checkToken from "../../Functions/GetUserFromToken";

class UserActions {
  user: User = {
    id: '',
    email: '',
    username: '',
  };

  constructor() {
    makeAutoObservable(this);
  }

  init = () => {
    this.getUserData();
  }

  getUserData = async () => {
    this.user = await checkToken();
    console.log(this.user);
  }

  deleteUser = async () => {
    const token = getCookie('token');
    const deleteMutation = `
    mutation {deleteUser {
      message
      user {
        username
        email
        id
      }
    }}
    `;

    const request = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
      body: JSON.stringify({ query: deleteMutation }),
    });
    const response = await request.json();
    console.log(response);
    logout();
  }

  updateUser = async (user: UserInput) => {
    const token = getCookie('token');
    const updateUserMutation = `
    mutation {updateUser(user: {username: "${user.username}", email: "${user.email}", password: "${user.password}"}){
      message
      user {
        username
        email
        id
      }
    }}
    `;

    const request = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
      body: JSON.stringify({ query: updateUserMutation }),
    });
    const response = await request.json();
    this.user = response.data.updateUser.user;
  }
}

const userActions = new UserActions();
export default userActions;
