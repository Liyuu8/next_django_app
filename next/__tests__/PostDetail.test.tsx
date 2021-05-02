import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

import PostDetail from '../pages/posts/[id]';
import { POST } from '../types/Types';

describe('PostDetailPage Test Cases', () => {
  const dummyProps: POST = {
    id: 1,
    title: 'dummy title 1',
    content: 'dummy content 1',
    username: 'dummy username 1',
    tags: [
      { id: 1, name: 'tag1' },
      { id: 2, name: 'tag2' },
    ],
    created_at: '2021-04-26 20:00:00',
  };
  it('Should render corrently with given props value', () => {
    render(<PostDetail {...dummyProps} />);

    expect(screen.getByText(dummyProps.title)).toBeInTheDocument();
    expect(screen.getByText(dummyProps.content)).toBeInTheDocument();
    expect(screen.getByText('by ' + dummyProps.username)).toBeInTheDocument();
    expect(screen.getByText(dummyProps.tags[0].name)).toBeInTheDocument();
    expect(screen.getByText(dummyProps.tags[1].name)).toBeInTheDocument();
    expect(screen.getByText(dummyProps.created_at)).toBeInTheDocument();
  });
});
