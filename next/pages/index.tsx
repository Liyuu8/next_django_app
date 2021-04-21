import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Cookie from 'universal-cookie';

import Layout from '../components/Layout';
import { getAllPostsData, deletePostData } from '../lib/fetch';
import { POST } from '../types/Types';

const cookie = new Cookie();
const COOKIE_KEY = 'access_token';

interface STATIC_PROPS {
  posts: POST[];
}

const BlogPage: React.FC<STATIC_PROPS> = ({ posts }) => {
  const [hasToken, setHasToken] = useState(false);
  useEffect(() => cookie.get(COOKIE_KEY) && setHasToken(true), []);

  const logout = () => {
    cookie.remove(COOKIE_KEY);
    setHasToken(false);
  };

  return (
    <Layout title="Blog">
      <p className="text-4xl mb-10">blog page</p>
      <ul>
        {posts &&
          posts.map((post) => (
            <li key={post.id}>
              <Link href={`posts/${post.id}`}>
                <a className="cursor-pointer border-b border-gray-500 hover:border-gray-300">
                  {post.title}
                </a>
              </Link>
              {hasToken && (
                <svg
                  onClick={() =>
                    deletePostData(post.id, cookie.get(COOKIE_KEY))
                  }
                  data-testid={`btn-${post.id}`}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 ml-10 float-right cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </li>
          ))}
      </ul>
      {hasToken && (
        <svg
          onClick={logout}
          data-testid="logout-icon"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mt-10 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      )}
    </Layout>
  );
};

export default BlogPage;

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPostsData();

  return { props: { posts }, revalidate: 3 };
};
