import { User, UserInput } from "../Types/User";
import { getCookie } from "typescript-cookie";

const checkToken = async () => {
  const token = getCookie('token');
    console.log("TOKEN: ", token);
    const checkTokenQuery = `
    query {checkToken {
      message
      user {
        username
        email
        id
        isFollowing {
          name
        }
      }
    }}`;

    const request = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
      body: JSON.stringify({ query: checkTokenQuery }),
    });
    const response = await request.json();
    console.log(response);
    const user = response.data.checkToken.user as User;
    console.log(user);
    return user;
}

const getUserId = async () => {
  const user = await checkToken();
  return user.id;
}

export default checkToken;
export { getUserId };
