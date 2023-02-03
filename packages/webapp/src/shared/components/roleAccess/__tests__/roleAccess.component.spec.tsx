import { screen } from '@testing-library/react';

import { render, PLACEHOLDER_CONTENT, PLACEHOLDER_TEST_ID } from '../../../../tests/utils/rendering';
import { Role } from '../../../../modules/auth/auth.types';
import { RoleAccess, RoleAccessProps } from '../roleAccess.component';
import { currentUserFactory } from '../../../../mocks/factories';
import { fillCommonQueryWithUser } from '../../../utils/commonQuery';

describe('RoleAccess: Component', () => {
  const defaultProps: RoleAccessProps = {
    allowedRoles: [Role.ADMIN],
    children: PLACEHOLDER_CONTENT,
  };

  const Component = (props: Partial<RoleAccessProps>) => <RoleAccess {...defaultProps} {...props} />;

  it('should render children if user has allowed role', async () => {
    const apolloMocks = [fillCommonQueryWithUser(undefined, currentUserFactory({ roles: [Role.ADMIN] }))];
    render(<Component allowedRoles={Role.ADMIN} />, { apolloMocks });
    expect(await screen.findByTestId(PLACEHOLDER_TEST_ID)).toBeInTheDocument();
  });

  it('should render nothing if user doesnt have allowed role', async () => {
    const apolloMocks = [fillCommonQueryWithUser(undefined, currentUserFactory({ roles: [Role.USER] }))];
    const { waitForApolloMocks } = render(<Component allowedRoles={Role.ADMIN} />, { apolloMocks });
    await waitForApolloMocks();
    expect(screen.queryByTestId(PLACEHOLDER_TEST_ID)).not.toBeInTheDocument();
  });
});