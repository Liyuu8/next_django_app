import '@testing-library/jest-dom/extend-expect';
import { render, screen, cleanup } from '@testing-library/react';
import { getPage } from 'next-page-tester';
import { initTestHelpers } from 'next-page-tester';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';

initTestHelpers();

const ENDPOINT = 'http://localhost:8000/api';

const ids = [1, 2, 3];
const handlers = [
  rest.get(`${ENDPOINT}/get-blogs/`, (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json(
        ids.map((id) => ({
          id,
          title: `dummy title ${id}`,
          content: `dummy content ${id}`,
          username: `dummy username ${id}`,
          tags: [
            { id: 1, name: 'tag1' },
            { id: 2, name: 'tag2' },
          ],
          created_at: '2021-04-26 20:00:00',
        }))
      )
    )
  ),
  ...ids.map((id) =>
    rest.get(`${ENDPOINT}/get-blogs/${id}/`, (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          id,
          title: `dummy title ${id}`,
          content: `dummy content ${id}`,
          username: `dummy username ${id}`,
          tags: [
            { id: 1, name: 'tag1' },
            { id: 2, name: 'tag2' },
          ],
          created_at: '2021-04-26 20:00:00',
        })
      )
    )
  ),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
beforeEach(
  () =>
    (process.env = Object.assign(process.env, {
      NEXT_PRIVATE_RESTAPI_URL: ENDPOINT,
      NEXT_PUBLIC_RESTAPI_URL: ENDPOINT,
    }))
  // https://github.com/vuejs/vue-test-utils/issues/193#issuecomment-438437626
);
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());

describe('BlogDetail Test Cases', () => {
  it('Should render detailed content of id 1', async () => {
    const { page } = await getPage({ route: '/posts/1' });
    render(page);

    expect(await screen.findByText('dummy title 1')).toBeInTheDocument();
    expect(screen.getByText('dummy content 1')).toBeInTheDocument();
    expect(screen.getByText('by dummy username 1')).toBeInTheDocument();
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
  });

  it('Should render detailed content of id 2', async () => {
    const { page } = await getPage({ route: '/posts/2' });
    render(page);

    expect(await screen.findByText('dummy title 2')).toBeInTheDocument();
    expect(screen.getByText('dummy content 2')).toBeInTheDocument();
    expect(screen.getByText('by dummy username 2')).toBeInTheDocument();
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
  });

  it('Should route back to blog-page from detail page', async () => {
    const { page } = await getPage({ route: '/posts/3' });
    render(page);

    expect(await screen.findByText('dummy title 3')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('back-blog'));
    expect(await screen.findByText('blog page')).toBeInTheDocument();
  });
});
