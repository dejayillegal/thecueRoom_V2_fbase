import { fireEvent, render } from '@testing-library/react-native';
import { LandingScreen } from '../src/screens/Landing';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('LandingScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders hero copy and actions', () => {
    const { getByText } = render(<LandingScreen />);

    expect(getByText('Command every cue from a single creative cockpit.')).toBeTruthy();
    expect(getByText('Magic Link Login')).toBeTruthy();
    expect(getByText('Explore Feed')).toBeTruthy();
  });

  it('navigates when buttons are pressed', () => {
    const { getByText } = render(<LandingScreen />);

    fireEvent.press(getByText('Magic Link Login'));
    fireEvent.press(getByText('Explore Feed'));

    expect(mockNavigate).toHaveBeenCalledWith('Login');
    expect(mockNavigate).toHaveBeenCalledWith('Feed');
  });
});
