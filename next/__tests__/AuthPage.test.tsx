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
  rest.post(`${ENDPOINT}/jwt/create/`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ access: '123xyz' }))
  ),
  rest.post(`${ENDPOINT}/register/`, (req, res, ctx) => res(ctx.status(201))),
  rest.get(`${ENDPOINT}/posts/`, (req, res, ctx) =>
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
});
afterAll(() => server.close());

describe('AdminPage Test Cases', () => {
  it('Should route to index-page when login is success', async () => {
    const { page } = await getPage({ route: '/admin-page' });
    render(page);

    expect(await screen.findByText('Login')).toBeInTheDocument();
    userEvent.type(screen.getByPlaceholderText('Username'), 'dummy_user');
    userEvent.type(screen.getByPlaceholderText('Password'), 'dummy_pw');
    userEvent.click(screen.getByText('Login with JWT'));
    expect(await screen.findByText('blog page')).toBeInTheDocument();
  });

  it('Should not route to index-page when login is failed', async () => {
    server.use(
      rest.post(`${ENDPOINT}/jwt/create/`, (req, res, ctx) =>
        res(ctx.status(400))
      )
    );

    const { page } = await getPage({ route: '/admin-page' });
    render(page);

    expect(await screen.findByText('Login')).toBeInTheDocument();
    userEvent.type(screen.getByPlaceholderText('Username'), 'dummy_user');
    userEvent.type(screen.getByPlaceholderText('Password'), 'dummy_pw');
    userEvent.click(screen.getByText('Login with JWT'));
    expect(await screen.findByText(/Login Error/)).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('blog page')).toBeNull();
  });

  it('Should change to register mode', async () => {
    const { page } = await getPage({ route: '/admin-page' });
    render(page);

    expect(await screen.findByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Login with JWT')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('mode-change'));
    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.getByText('Create new user')).toBeInTheDocument();
  });

  it('Should route to index-page when register and login is success', async () => {
    const { page } = await getPage({ route: '/admin-page' });
    render(page);

    expect(await screen.findByText('Login')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('mode-change'));
    userEvent.type(screen.getByPlaceholderText('Username'), 'dummy_user_2');
    userEvent.type(screen.getByPlaceholderText('Password'), 'dummy_pw_2');
    userEvent.click(screen.getByText('Create new user'));
    expect(await screen.findByText('blog page')).toBeInTheDocument();
  });

  it('Should not route to index-page when registation is failed', async () => {
    server.use(
      rest.post(`${ENDPOINT}/register/`, (req, res, ctx) =>
        res(ctx.status(400))
      )
    );

    const { page } = await getPage({ route: '/admin-page' });
    render(page);

    expect(await screen.findByText('Login')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('mode-change'));
    userEvent.type(screen.getByPlaceholderText('Username'), 'dummy_user_2');
    userEvent.type(screen.getByPlaceholderText('Password'), 'dummy_pw_2');
    userEvent.click(screen.getByText('Create new user'));
    expect(await screen.findByText(/SignUp Error/)).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.queryByText('blog page')).toBeNull();
  });
});
