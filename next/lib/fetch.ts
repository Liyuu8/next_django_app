import fetch from 'node-fetch';

export const ENDPOINT = process.env.NEXT_PUBLIC_RESTAPI_URL;

export const getAllPostsData = async () => {
  const response = await fetch(new URL(`${ENDPOINT}/get-blogs`));
  const posts = await response.json();

  return posts;
};

export const getAllPostIds = async () => {
  const posts = await getAllPostsData();

  return posts.map((post) => ({ params: { id: String(post.id) } }));
};

export const getPostData = async (id: number) => {
  const response = await fetch(new URL(`${ENDPOINT}/get-blogs/${id}`));
  const post = await response.json();

  return post;
};

export const deletePostData = async (id: number, token: string) => {
  const response = await fetch(new URL(`${ENDPOINT}/delete-blog/${id}`));
  if (response.status === 401) alert('JWT Token not valid ');
};
