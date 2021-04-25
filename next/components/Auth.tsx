import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'universal-cookie';
import { authUser } from '../lib/auth';

const cookie = new Cookie();

const Auth: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();

  return (
    <>
      <p className="text-3xl text-center">{isLogin ? 'Login' : 'Sign up'}</p>

      <form
        onSubmit={async (e) =>
          (await authUser(
            e,
            { username, password, cookie, isLogin },
            (e) => setError(`Login ${e}`),
            (e) => setError(`SignUp ${e}`)
          )) && router.push('/')
        }
        className="mt-8 space-y-3"
      >
        <div>
          <input
            type="text"
            required
            className="px-3 py-2 border border-gray-300"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            required
            className="px-3 py-2 border border-gray-300"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <p
          className="cursor-pointer flex items-center justify-center flex-col font-medium hover:text-indigo-500"
          data-testid="mode-change"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
        >
          {isLogin ? 'Sign up?' : 'Login?'}
        </p>

        <div className="flex items-center justify-center flex-col">
          <button
            type="submit"
            disabled={!username || !password}
            className="disabled:opacity-40 py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </form>

      {error && <p className="mt-5 text-red-600">{error}</p>}
    </>
  );
};

export default Auth;
