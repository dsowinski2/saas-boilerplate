import { FormattedMessage, useIntl } from 'react-intl';
import { ApolloError } from '@apollo/client';

import { Input } from '../../../shared/components/forms/input';
import { Button, ButtonVariant } from '../../../shared/components/forms/button';
import { Link } from '../../../shared/components/link';
import { RoutesConfig } from '../../../app/config/routes';
import { useGenerateLocalePath } from '../../../shared/hooks/localePaths';

import { Buttons, Container, ErrorMessage, Fields, Form } from './crudDemoItemForm.styles';
import { useCrudDemoItemForm } from './crudDemoItemForm.hook';

const MAX_NAME_LENGTH = 255;

export type CrudDemoItemFormFields = {
  name: string;
};

export type CrudDemoItemFormProps = {
  onSubmit: (formData: CrudDemoItemFormFields) => void;
  loading: boolean;
  initialData?: CrudDemoItemFormFields | null;
  error?: ApolloError;
};

export const CrudDemoItemForm = ({ initialData, onSubmit, error, loading }: CrudDemoItemFormProps) => {
  const intl = useIntl();
  const generateLocalePath = useGenerateLocalePath();

  const {
    form: {
      register,
      formState: { errors },
    },
    genericError,
    hasGenericErrorOnly,
    handleFormSubmit,
  } = useCrudDemoItemForm({ initialData, onSubmit, error });

  return (
    <Container>
      <Form onSubmit={handleFormSubmit}>
        <Fields>
          <Input
            {...register('name', {
              maxLength: {
                value: MAX_NAME_LENGTH,
                message: intl.formatMessage({
                  defaultMessage: 'Name is too long',
                  id: 'CrudDemoItem form / Name max length error',
                }),
              },
              required: {
                value: true,
                message: intl.formatMessage({
                  defaultMessage: 'Name is required',
                  id: 'CrudDemoItem form / Name required',
                }),
              },
            })}
            label={intl.formatMessage({
              defaultMessage: 'Name:',
              id: 'CrudDemoItem Form / Name label',
            })}
            placeholder={intl.formatMessage({
              defaultMessage: 'Name',
              id: 'CrudDemoItem form / Name placeholder',
            })}
            error={errors.name?.message}
          />

          {hasGenericErrorOnly && <ErrorMessage>{genericError}</ErrorMessage>}
        </Fields>

        <Buttons>
          <Link to={generateLocalePath(RoutesConfig.crudDemoItem.list)} variant={ButtonVariant.SECONDARY}>
            <FormattedMessage defaultMessage="Cancel" id="CrudDemoItem form / Cancel button" />
          </Link>

          <Button type="submit" disabled={loading}>
            <FormattedMessage defaultMessage="Save changes" id="CrudDemoItem form / Submit button" />
          </Button>
        </Buttons>
      </Form>
    </Container>
  );
};