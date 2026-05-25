import {
  Column,
  Form,
  FormButtons,
  FormField,
  FormSubmitButton,
  Heading,
  Icon,
  PasswordField,
  TextField,
} from '@umami/react-zen';
import { useRouter } from 'next/navigation';
import { useMessages, useUpdateQuery } from '@/components/hooks';
import { Logo } from '@/components/svg';
import { setClientAuthToken } from '@/lib/client';
import { consumeReturnUrl } from '@/lib/return-url';
import { setUser } from '@/store/app';

export function LoginForm() {
  const { t, labels, getErrorMessage } = useMessages();
  const router = useRouter();
  const { mutateAsync, error } = useUpdateQuery('/auth/login');

  const handleSubmit = async (data: any) => {
    await mutateAsync(data, {
      onSuccess: async (response: any) => {
        if (response.requiresTwoFactor) {
          sessionStorage.setItem('umami.partial-token', response.partialToken);
          router.push('/login/two-factor');
          return;
        }
        setClientAuthToken(response.token);
        setUser(response.user);
        router.push(consumeReturnUrl() ?? '/');
      },
    });
  };

  return (
    <Column justifyContent="center" alignItems="center" gap="6">
      <Icon size="lg">
        <Logo />
      </Icon>
      <Heading>umami</Heading>
      <Form
        onSubmit={handleSubmit}
        error={getErrorMessage(error)}
        defaultValues={{ username: '', password: '' }}
        style={{ minWidth: 300 }}
      >
        <FormField
          label={t(labels.username)}
          data-test="input-username"
          name="username"
          rules={{ required: t(labels.required) }}
        >
          <TextField autoComplete="username" />
        </FormField>

        <FormField
          label={t(labels.password)}
          data-test="input-password"
          name="password"
          rules={{ required: t(labels.required) }}
        >
          <PasswordField autoComplete="current-password" />
        </FormField>
        <FormButtons>
          <FormSubmitButton
            data-test="button-submit"
            variant="primary"
            style={{ flex: 1 }}
            isDisabled={false}
          >
            {t(labels.login)}
          </FormSubmitButton>
        </FormButtons>
      </Form>
      <div
        style={{
          minWidth: 300,
          textAlign: 'center',
          fontSize: '0.8rem',
          opacity: 0.6,
          lineHeight: 1.6,
        }}
      >
        <p style={{ margin: '0 0 4px' }}>
          Acceso privado para clientes de{' '}
          <a
            href="https://zagus.me"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            zagus.me
          </a>
        </p>
        <p style={{ margin: 0 }}>
          ¿Olvidaste tu contraseña?{' '}
          <a href="mailto:legal@zagus.me" style={{ color: 'inherit', textDecoration: 'underline' }}>
            legal@zagus.me
          </a>
        </p>
      </div>
    </Column>
  );
}
