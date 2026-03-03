import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAddMember } from '../hooks/useHousehold';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';

interface AddMemberDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddMemberDialog({ open, onClose }: AddMemberDialogProps) {
  const { t } = useTranslation();
  const addMember = useAddMember();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');

  function handleClose() {
    setEmail('');
    setDisplayName('');
    setPassword('');
    addMember.reset();
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addMember.mutate(
      { email: email.trim(), password, displayName: displayName.trim() || null },
      { onSuccess: handleClose }
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('household.addMember.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member-email">{t('household.addMember.email')}</Label>
            <Input
              id="member-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="member-display-name">
              {t('household.addMember.displayName')}{' '}
              <span className="text-muted-foreground text-xs">({t('accounts.form.optional')})</span>
            </Label>
            <Input
              id="member-display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="member-password">{t('household.addMember.password')}</Label>
            <Input
              id="member-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={12}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={addMember.isPending}>
              {addMember.isPending ? t('common.saving') : t('household.addMember.submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
