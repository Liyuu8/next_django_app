import Link from 'next/link';
import { GetStaticProps, GetStaticPaths } from 'next';

import Layout from '../../components/Layout';
import { getAllPostIds, getPostData } from '../../lib/fetch';
import { POST } from '../../types/Types';

const tagClassList = [
  'bg-blue-500',
  'bg-gray-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-indigo-500',
  'bg-gray-400',
];

const PostDetail: React.FC<POST> = ({
  title,
  content,
  username,
  tags,
  created_at,
}) => (
  <Layout title={title}>
    <div>
      {tags &&
        tags.map((tag, index) => (
          <span
            key={tag.id}
            className={`px-2 py-2 m-1 text-white rounded ${
              tagClassList[
                index < tagClassList.length ? index : tagClassList.length - 1
              ]
            }`}
          >
            {tag.name}
          </span>
        ))}
    </div>
    <p className="m-10 text-xl font-bold">{title}</p>
    <p className="mx-10 mb-12">{content}</p>
    <p>{created_at}</p>
    <p className="mt-3">{`by ${username}`}</p>
    <Link href="/">
      <div className="flex cursor-pointer mt-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
        </svg>
        <a date-testid="back-blog">Back to blog page</a>
      </div>
    </Link>
  </Layout>
);

export default PostDetail;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllPostIds();

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const post = await getPostData(ctx.params.id as string);

  return { props: { ...post }, revalidate: 3 };
};
