import * as nFetch from 'node-fetch';

const PRIVATE_ENDPOINT = process.env.NEXT_PRIVATE_RESTAPI_URL;
const PUBLIC_ENDPOINT = process.env.NEXT_PUBLIC_RESTAPI_URL;

export const getAllPostsData = async () => {
  const response = await nFetch.default(
    new URL(`${PRIVATE_ENDPOINT}/get-blogs`)
  );
  const posts = await response.json();

  return posts;
};

export const getAllPostIds = async () => {
  const posts = await getAllPostsData();

  return posts.map((post) => ({ params: { id: String(post.id) } }));
};

export const getPostData = async (id: string) => {
  const response = await nFetch.default(
    new URL(`${PRIVATE_ENDPOINT}/get-blogs/${id}`)
  );
  const post = await response.json();

  return post;
};

export const deletePostData = async (id: number, token: string) => {
  const response = await fetch(`${PUBLIC_ENDPOINT}/delete-blog/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  if (response.status === 401) alert('JWT Token not valid ');
};
