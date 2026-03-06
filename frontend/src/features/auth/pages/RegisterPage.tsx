import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { RegisterForm } from '../components/RegisterForm';
import { InitialSecretsModal } from '../components/InitialSecretsModal';
import { setupApi } from '../api/authApi';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';

export function RegisterPage() {
  const { t } = useTranslation();
  const [secretsAcknowledged, setSecretsAcknowledged] = useState(false);

  // Check whether initial secrets exist (first-run only). The backend returns 410
  // once a user has registered, so this query will silently fail in normal operation.
  const { data: secretsData } = useQuery({
    queryKey: ['setup', 'initial-secrets'],
    queryFn: async () => {
      const res = await setupApi.getInitialSecrets();
      return res.data.data;
    },
    staleTime: Infinity,
    retry: false,
  });

  const hasSecrets = Boolean(
    secretsData && (secretsData.masterSecret || secretsData.secrets.length > 0)
  );
  const showSecretsModal = hasSecrets && !secretsAcknowledged;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{t('auth.appName')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('auth.tagline')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('auth.createAccount')}</CardTitle>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>

      <InitialSecretsModal
        open={showSecretsModal}
        onAcknowledged={() => setSecretsAcknowledged(true)}
      />
    </div>
  );
}
