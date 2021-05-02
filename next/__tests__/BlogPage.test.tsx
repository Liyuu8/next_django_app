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
  document.cookie =
    'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
});
afterAll(() => server.close());

describe('BlogPage Test Cases', () => {
  it('Should route to admin page and route back to blog page', async () => {
    const { page } = await getPage({ route: '/' });
    render(page);

    userEvent.click(screen.getByTestId('admin-nav'));
    expect(await screen.findByText('Login')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('blog-nav'));
    expect(await screen.findByText('blog page')).toBeInTheDocument();
  });

  it('Should render delete button and logout button when JWT token cookie exist', async () => {
    document.cookie = 'access_token=123xyz';
    const { page } = await getPage({ route: '/' });
    render(page);

    expect(await screen.findByText('blog page')).toBeInTheDocument();
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
    expect(screen.getByTestId('delete-post1-btn')).toBeInTheDocument();
    expect(screen.getByTestId('delete-post2-btn')).toBeInTheDocument();
  });

  it('Should not render delete button and logout button when no cookie', async () => {
    const { page } = await getPage({ route: '/' });
    render(page);

    expect(await screen.findByText('blog page')).toBeInTheDocument();
    expect(screen.queryByTestId('logout-icon')).toBeNull();
    expect(screen.queryByTestId('delete-post1-btn')).toBeNull();
    expect(screen.queryByTestId('delete-post2-btn')).toBeNull();
  });

  it('Should render the list of blogs pre-fetched by getStaticProps', async () => {
    const { page } = await getPage({ route: '/' });
    render(page);

    expect(await screen.findByText('blog page')).toBeInTheDocument();
    expect(screen.getByText('dummy title 1')).toBeInTheDocument();
    expect(screen.getByText('dummy title 2')).toBeInTheDocument();
  });
});
