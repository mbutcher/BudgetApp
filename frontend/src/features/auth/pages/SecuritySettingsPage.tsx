import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LogOut, LogOutIcon, Shield, Fingerprint, Monitor } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import { useTotpSetup } from '../hooks/useTotpSetup';
import { TotpSetup } from '../components/TotpSetup';
import { PasskeySetup } from '../components/PasskeySetup';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Alert, AlertDescription } from '@components/ui/alert';
import { Separator } from '@components/ui/separator';
import { getApiErrorMessage } from '@lib/api/errors';


export function SecuritySettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, clearAuth } = useAuthStore();
  const [showTotpSetup, setShowTotpSetup] = useState(false);
  const { disable: disableTotp, isDisabling, disableError } = useTotpSetup();

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });

  const logoutAllMutation = useMutation({
    mutationFn: () => authApi.logoutAll(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });

  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ['auth-sessions'],
    queryFn: () => authApi.listSessions().then((r) => r.data.data.sessions),
  });

  const revokeSessionMutation = useMutation({
    mutationFn: (sessionId: string) => authApi.revokeSession(sessionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auth-sessions'] }),
  });

  const sessions = sessionsData ?? [];

  return (
    <div className="min-h-screen bg-muted/40 p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('security.title')}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            isLoading={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut className="h-4 w-4" />
            {t('security.signOut')}
          </Button>
        </div>

        {/* TOTP Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">{t('security.totp')}</CardTitle>
              </div>
              <Badge variant={user?.totpEnabled ? 'default' : 'secondary'}>
                {user?.totpEnabled ? t('security.enabled') : t('security.disabled')}
              </Badge>
            </div>
            <CardDescription>{t('security.totpDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {disableError && (
              <Alert variant="destructive">
                <AlertDescription>{getApiErrorMessage(disableError)}</AlertDescription>
              </Alert>
            )}

            {user?.totpEnabled ? (
              <div className="space-y-2">
                {!showTotpSetup ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTotpSetup(true)}
                    >
                      {t('security.reconfigure')}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      isLoading={isDisabling}
                      onClick={disableTotp}
                    >
                      {t('security.disable')}
                    </Button>
                  </div>
                ) : (
                  <TotpSetup onComplete={() => setShowTotpSetup(false)} />
                )}
              </div>
            ) : (
              <TotpSetup onComplete={() => {}} />
            )}
          </CardContent>
        </Card>

        {/* Passkeys Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">{t('security.passkeys')}</CardTitle>
            </div>
            <CardDescription>{t('security.passkeysDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <PasskeySetup />
          </CardContent>
        </Card>

        {/* Session Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <LogOutIcon className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">{t('security.sessions')}</CardTitle>
            </div>
            <CardDescription>{t('security.sessionsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Session list */}
            {sessionsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded-md" />
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('security.sessionsEmpty')}</p>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-lg border px-3 py-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Monitor className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {session.deviceName ?? 'Unknown device'}
                          </p>
                          {session.isCurrent && (
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              {t('security.sessionsThisDevice')}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.ipAddress ?? '—'} · {t('security.sessionsSignedIn')}{' '}
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive flex-shrink-0"
                        isLoading={revokeSessionMutation.isPending}
                        onClick={() => revokeSessionMutation.mutate(session.id)}
                      >
                        {t('security.sessionsSignOut')}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t('security.signOutEverywhere')}</p>
                <p className="text-xs text-muted-foreground">{t('security.signOutEverywhereDesc')}</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                isLoading={logoutAllMutation.isPending}
                onClick={() => logoutAllMutation.mutate()}
              >
                {t('security.signOutAll')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
