import { render } from '@testing-library/react-native';
import { FeedScreen } from '../src/screens/Feed.tsx';

describe('FeedScreen', () => {
  it('shows the feed header', () => {
    const { getByText } = render(<FeedScreen />);

    expect(getByText('Live community feed')).toBeTruthy();
    expect(
      getByText('Realtime updates will render here once Supabase channels are connected.'),
    ).toBeTruthy();
  });
});
