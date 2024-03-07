import { setCookie } from "typescript-cookie";

const logout = () => {
  setCookie('token', '', { expires: -1 });
  window.location.href = '/';
}

export default logout;
