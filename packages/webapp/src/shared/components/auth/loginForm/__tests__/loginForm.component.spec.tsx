import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { GraphQLError } from 'graphql/error/GraphQLError';

import { render } from '../../../../../tests/utils/rendering';
import { LoginForm } from '../loginForm.component';

import { RoutesConfig } from '../../../../../app/config/routes';
import { composeMockedQueryResult } from '../../../../../tests/utils/fixtures';
import { fillCommonQueryWithUser } from '../../../../utils/commonQuery';
import { authSinginMutation } from '../loginForm.graphql';
import { currentUserFactory } from '../../../../../mocks/factories';
import { Role } from '../../../../../modules/auth/auth.types';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual<NodeModule>('react-router-dom'),
    useNavigate: () => mockNavigate,
  };
});
const Component = () => <LoginForm />;
describe('LoginForm: Component', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  const mockCredentials = {
    input: {
      email: 'user@mail.com',
      password: 'abcxyz123456',
    },
  };

  const getEmailInput = async () => await screen.findByLabelText(/email/i);
  const getPasswordInput = async () => await screen.findByLabelText(/password/i);
  const clickLoginButton = async () => userEvent.click(await screen.findByRole('button', { name: /log in/i }));
  const user = currentUserFactory({
    firstName: 'Jack',
    lastName: 'White',
    email: 'jack.white@mail.com',
    roles: [Role.USER],
  });

  it('should call login action when submitted', async () => {
    const refreshQueryMock = fillCommonQueryWithUser(undefined, user);
    const requestMock = composeMockedQueryResult(authSinginMutation, {
      variables: mockCredentials,
      data: {
        tokenAuth: {
          access: 'access-token',
          refresh: 'refresh-token',
        },
      },
    });
    const { waitForApolloMocks } = render(<Component />, {
      apolloMocks: (defaultMocks) => defaultMocks.concat(requestMock, refreshQueryMock),
    });

    await userEvent.type(await getEmailInput(), mockCredentials.input.email);
    await userEvent.type(await getPasswordInput(), mockCredentials.input.password);

    await clickLoginButton();
    await waitForApolloMocks();
    expect(await mockNavigate).toHaveBeenCalledWith(`/en/${RoutesConfig.home}`);
  });

  it('should show error if required value is missing', async () => {
    render(<Component />);

    await userEvent.type(await getEmailInput(), 'user@mail.com');

    await clickLoginButton();

    expect(await screen.findByText('Password is required')).toBeInTheDocument();
    expect(await mockNavigate).not.toHaveBeenCalled();
  });

  it('should show generic form error if action throws error', async () => {
    const errorMessage = 'Incorrect authentication credentials.';

    const requestMock = {
      request: {
        query: authSinginMutation,
        variables: mockCredentials,
      },
      result: {
        data: {},
        errors: [
          new GraphQLError('GraphQlValidationError', {
            extensions: { nonFieldErrors: [{ message: errorMessage, code: 'Incorrect authentication credentials.' }] },
          }),
        ],
      },
    };

    render(<Component />, { apolloMocks: (defaultMocks) => defaultMocks.concat(requestMock) });

    await userEvent.type(await getEmailInput(), mockCredentials.input.email);
    await userEvent.type(await getPasswordInput(), mockCredentials.input.password);

    await clickLoginButton();

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    expect(await mockNavigate).not.toHaveBeenCalled();
  });

  it('should show common error if action throws error', async () => {
    const errorMessage = 'Server error';
    const requestMock = {
      request: {
        query: authSinginMutation,
        variables: mockCredentials,
      },
      data: {},
      result: { errors: [new GraphQLError(errorMessage)] },
    };

    render(<Component />, { apolloMocks: (defaultMocks) => defaultMocks.concat(requestMock) });

    await userEvent.type(await getEmailInput(), mockCredentials.input.email);
    await userEvent.type(await getPasswordInput(), mockCredentials.input.password);

    await clickLoginButton();

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    expect(await mockNavigate).not.toHaveBeenCalled();
  });
});