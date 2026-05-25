import {
  Column,
  Form,
  FormButtons,
  FormField,
  FormSubmitButton,
  Heading,
  Icon,
  PasswordField,
  Row,
  Text,
  TextField,
} from '@umami/react-zen';
import { useRouter } from 'next/navigation';
import type { CSSProperties } from 'react';
import { useMessages, useUpdateQuery } from '@/components/hooks';
import { ExternalLink, Globe, Mail } from '@/components/icons';
import { Logo } from '@/components/svg';
import { setClientAuthToken } from '@/lib/client';
import { consumeReturnUrl } from '@/lib/return-url';
import { setUser } from '@/store/app';

const linkCardStyle: CSSProperties = {
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
};

const hoverableStyle: CSSProperties = {
  transition: 'background 0.15s, border-color 0.15s',
  cursor: 'pointer',
};

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

      <Column gap="3" style={{ minWidth: 300 }}>
        <Row alignItems="center" gap="3">
          <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
          <Text size="xs" style={{ color: 'var(--text-disabled)', whiteSpace: 'nowrap' }}>
            Acceso privado
          </Text>
          <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
        </Row>

        <a href="https://zagus.me" target="_blank" rel="noopener noreferrer" style={linkCardStyle}>
          <Row
            alignItems="center"
            gap="3"
            paddingX="3"
            paddingY="2"
            borderRadius
            border
            backgroundColor="surface-base"
            style={hoverableStyle}
          >
            <Icon size="sm">
              <Globe />
            </Icon>
            <Column gap="0" style={{ flex: 1 }}>
              <Text size="xs" style={{ color: 'var(--text-disabled)' }}>
                Propietario
              </Text>
              <Text size="sm" weight="bold">
                zagus.me
              </Text>
            </Column>
            <Icon size="xs" style={{ opacity: 0.35 }}>
              <ExternalLink />
            </Icon>
          </Row>
        </a>

        <a href="mailto:legal@zagus.me" style={linkCardStyle}>
          <Row
            alignItems="center"
            gap="3"
            paddingX="3"
            paddingY="2"
            borderRadius
            border
            backgroundColor="surface-base"
            style={hoverableStyle}
          >
            <Icon size="sm">
              <Mail />
            </Icon>
            <Column gap="0">
              <Text size="xs" style={{ color: 'var(--text-disabled)' }}>
                ¿Olvidaste tu contraseña?
              </Text>
              <Text size="sm" weight="bold">
                legal@zagus.me
              </Text>
            </Column>
          </Row>
        </a>
      </Column>
    </Column>
  );
}
