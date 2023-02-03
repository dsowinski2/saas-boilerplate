import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';

import { currentUserFactory, fillNotificationsListQuery } from '../../../../../mocks/factories';
import { render } from '../../../../../tests/utils/rendering';
import { RoutesConfig } from '../../../../../app/config/routes';
import { Header } from '../header.component';
import { fillCommonQueryWithUser } from '../../../../utils/commonQuery';

const getApolloMocks = () => [
  fillCommonQueryWithUser(undefined, currentUserFactory()),
  fillNotificationsListQuery(undefined, [], { hasUnreadNotifications: false }),
];

describe('Header: Component', () => {
  const Component = () => (
    <Routes>
      <Route path="/" element={<Header />} />
      <Route path={RoutesConfig.getLocalePath(['home'])} element={<span>Home mock route</span>} />
      <Route path={RoutesConfig.getLocalePath(['profile'])} element={<span>Profile mock route</span>} />
      <Route path={RoutesConfig.getLocalePath(['logout'])} element={<span>Logout mock route</span>} />
    </Routes>
  );

  describe('user is logged in', () => {
    it('should open homepage when clicked on "home" link', async () => {
      const apolloMocks = getApolloMocks();
      render(<Component />, { apolloMocks });

      await userEvent.click(await screen.findByLabelText(/home/i));
      expect(screen.getByText('Home mock route')).toBeInTheDocument();
    });

    it('should open profile when clicked on "profile" link', async () => {
      const apolloMocks = getApolloMocks();
      render(<Component />, { apolloMocks });

      await userEvent.click(await screen.findByLabelText(/open profile menu/i));
      await userEvent.click(screen.getByText(/profile/i));
      expect(screen.getByText('Profile mock route')).toBeInTheDocument();
    });

    it('should dispatch logout action when clicking on "logout" button', async () => {
      const apolloMocks = getApolloMocks();
      render(<Component />, { apolloMocks });
      await userEvent.click(await screen.findByLabelText(/open profile menu/i));
      await userEvent.click(screen.getByText(/log out/i));
      expect(screen.getByText('Logout mock route')).toBeInTheDocument();
    });
  });

  describe('user is logged out', () => {
    it('should not display "home" link', async () => {
      const { waitForApolloMocks } = render(<Component />);
      await waitForApolloMocks();
      expect(screen.queryByText(/home/i)).not.toBeInTheDocument();
    });

    it('should not display avatar', async () => {
      const { waitForApolloMocks } = render(<Component />);
      await waitForApolloMocks();
      expect(screen.queryByLabelText(/open profile menu/i)).not.toBeInTheDocument();
    });

    it('should not display "profile" link', async () => {
      const { waitForApolloMocks } = render(<Component />);
      await waitForApolloMocks();
      expect(screen.queryByText(/profile/i)).not.toBeInTheDocument();
    });

    it('should not display "logout" link', async () => {
      const { waitForApolloMocks } = render(<Component />);
      await waitForApolloMocks();
      expect(screen.queryByText(/log out/i)).not.toBeInTheDocument();
    });
  });
});