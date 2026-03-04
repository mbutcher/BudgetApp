import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { useHousehold, useAccountShares, usePutAccountShares } from '../hooks/useHousehold';
import { useAuthStore } from '@features/auth/stores/authStore';
import type { Account } from '@features/core/types';
import type { AccountShareAccessLevel } from '../types';

interface ManageSharesDialogProps {
  account: Account;
  open: boolean;
  onClose: () => void;
}

type AccessDraft = Record<string, AccountShareAccessLevel | 'none'>;

export function ManageSharesDialog({ account, open, onClose }: ManageSharesDialogProps) {
  const { t } = useTranslation();
  const currentUserId = useAuthStore((s) => s.user?.id);

  const { data: household } = useHousehold();
  const { data: shares = [], isLoading: sharesLoading } = useAccountShares(account.id);
  const putShares = usePutAccountShares(account.id);

  // Build draft access map keyed by userId
  const [draft, setDraft] = useState<AccessDraft>({});

  useEffect(() => {
    if (!household || sharesLoading) return;
    const init: AccessDraft = {};
    for (const member of household.members) {
      if (member.userId === currentUserId) continue;
      const existing = shares.find((s) => s.sharedWithUserId === member.userId);
      init[member.userId] = existing?.accessLevel ?? 'none';
    }
    setDraft(init);
  }, [household, shares, sharesLoading, currentUserId]);

  const otherMembers = (household?.members ?? []).filter((m) => m.userId !== currentUserId);

  async function handleSave() {
    const payload = Object.entries(draft)
      .filter(([, level]) => level !== 'none')
      .map(([userId, accessLevel]) => ({ userId, accessLevel: accessLevel as AccountShareAccessLevel }));
    await putShares.mutateAsync({ shares: payload });
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users size={16} />
            {t('household.share.manageTitle')} — {account.name}
          </DialogTitle>
          <DialogDescription>
            {t('household.share.manageDescription')}
          </DialogDescription>
        </DialogHeader>

        {sharesLoading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">{t('common.loading')}</div>
        ) : otherMembers.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t('household.share.noMembers')}
          </p>
        ) : (
          <div className="space-y-3 py-2">
            {otherMembers.map((member) => {
              const access = draft[member.userId] ?? 'none';
              return (
                <div key={member.userId} className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {member.displayName ?? member.email}
                    </p>
                    {member.displayName && (
                      <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {(['none', 'view', 'write'] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDraft((d) => ({ ...d, [member.userId]: level }))}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                          access === level
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/70'
                        }`}
                      >
                        {t(`household.share.${level}`)}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex gap-2 justify-end pt-2">
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={putShares.isPending || otherMembers.length === 0}>
            {putShares.isPending ? t('common.saving') : t('household.share.saveSharing')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
