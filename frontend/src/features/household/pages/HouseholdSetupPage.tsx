import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSetupHousehold } from '../hooks/useHousehold';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';

export function HouseholdSetupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const setupHousehold = useSetupHousehold();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setupHousehold.mutate(name.trim(), {
      onSuccess: () => void navigate('/dashboard'),
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{t('auth.appName')}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('household.setup.title')}</CardTitle>
            <CardDescription>{t('household.setup.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="household-name">{t('household.settings.nameLabel')}</Label>
                <Input
                  id="household-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('household.setup.namePlaceholder')}
                  autoFocus
                  maxLength={100}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={!name.trim() || setupHousehold.isPending}
              >
                {setupHousehold.isPending ? t('common.saving') : t('household.setup.submit')}
              </Button>
              {setupHousehold.isError && (
                <p className="text-sm text-destructive text-center">
                  {(setupHousehold.error as Error).message}
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
