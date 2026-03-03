import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRegistrationStatus } from '@features/household/hooks/useHousehold';
import { LoginForm } from '../components/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';

export function LoginPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const justRegistered = params.get('registered') === 'true';
  const { data: regStatus } = useRegistrationStatus();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{t('auth.appName')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('auth.tagline')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('auth.signIn')}</CardTitle>
            {justRegistered && (
              <CardDescription className="text-green-600">
                {t('auth.accountCreated')}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <LoginForm />
            {regStatus?.registrationOpen && (
              <p className="mt-4 text-center text-sm text-muted-foreground">
                {t('auth.noAccount')}{' '}
                <Link to="/register" className="text-primary hover:underline">
                  {t('auth.createOne')}
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
