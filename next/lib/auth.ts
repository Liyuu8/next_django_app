import axios from 'axios';
import Cookies from 'universal-cookie';

interface AUTH_INFO {
  username: string;
  password: string;
  cookie: Cookies;
  isLogin: boolean;
}

export const COOKIE_KEY = 'access_token';

const signup = async (authInfo: AUTH_INFO, errorHandle: Function) => {
  const { username, password } = authInfo;

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_RESTAPI_URL}/register/`,
      { username, password },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (res.status === 201) return await login(authInfo, errorHandle);
  } catch (e) {
    errorHandle(e);
  }
  return false;
};

const login = async (authInfo: AUTH_INFO, errorHandle: Function) => {
  const { username, password, cookie } = authInfo;

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_RESTAPI_URL}/jwt/create/`,
      { username, password },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (res.status === 200) {
      cookie.set(COOKIE_KEY, res.data.access, { path: '/' });

      return true;
    }
  } catch (e) {
    errorHandle(e);
  }
  return false;
};

export const authUser = async (
  e: React.FormEvent<HTMLFormElement>,
  authInfo: AUTH_INFO,
  loginErrorHandle: Function,
  signUpErrorHandle: Function
) => {
  e.preventDefault();

  const { isLogin } = authInfo;
  return isLogin
    ? login(authInfo, loginErrorHandle)
    : signup(authInfo, signUpErrorHandle);
};

export const logout = (cookie: Cookies, deleteToken: Function) => {
  cookie.remove(COOKIE_KEY);
  deleteToken();
};
