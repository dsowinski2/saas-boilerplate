import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';

import { AnonymousRoute } from '../anonymousRoute.component';
import { render } from '../../../../../tests/utils/rendering';
import { currentUserFactory } from '../../../../../mocks/factories';
import { Role } from '../../../../../modules/auth/auth.types';
import { getRelayEnv } from '../../../../../tests/utils/relay';
import { fillCommonQueryWithUser } from '../../../../utils/commonQuery';

const mockDispatch = jest.fn();
jest.mock('../../../../../theme/initializeFontFace');

jest.mock('react-redux', () => ({
  ...jest.requireActual<NodeModule>('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('AnonymousRoute: Component', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  const Component = () => (
    <Routes>
      <Route path="/" element={<AnonymousRoute />}>
        <Route index element={<span data-testid="content" />} />
      </Route>
      <Route path="/en/home" element={<span data-testid="home-content" />} />
    </Routes>
  );

  describe('user is logged out', () => {
    it('should render content', async () => {
      render(<Component />);
      expect(await screen.findByTestId('content')).toBeInTheDocument();
    });
  });

  describe('user is logged in', () => {
    it('should redirect to homepage', async () => {
      const relayEnvironment = getRelayEnv();

      const apolloMocks = [
        fillCommonQueryWithUser(
          relayEnvironment,
          currentUserFactory({
            roles: [Role.ADMIN],
          })
        ),
      ];

      const { waitForApolloMocks } = render(<Component />, { apolloMocks });
      await waitForApolloMocks();
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('home-content')).not.toBeInTheDocument();
    });
  });
});