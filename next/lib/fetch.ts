import fetch from 'node-fetch';

export const getAllPostsData = async () => {
  const response = await fetch(
    new URL(`${process.env.NEXT_PRIVATE_RESTAPI_URL}/get-blogs`)
  );
  const posts = await response.json();

  return posts;
};

export const getAllPostIds = async () => {
  const posts = await getAllPostsData();

  return posts.map((post) => ({ params: { id: String(post.id) } }));
};

export const getPostData = async (id: string) => {
  const response = await fetch(
    new URL(`${process.env.NEXT_PRIVATE_RESTAPI_URL}/get-blogs/${id}`)
  );
  const post = await response.json();

  return post;
};

export const deletePostData = async (id: number, token: string) => {
  const response = await fetch(
    new URL(`${process.env.NEXT_PRIVATE_RESTAPI_URL}/delete-blog/${id}`),
    {
      method: 'DELETE',
      headers: { Authorization: `JWT ${token}` },
    }
  );
  if (response.status === 401) alert('JWT Token not valid ');
};
