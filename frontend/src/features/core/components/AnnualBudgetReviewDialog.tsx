import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { useBudgetLines } from '../hooks/useBudgetLines';
import { useMarkBudgetReviewComplete } from '@features/dashboard/hooks/useDashboardConfig';
import { useFormatters } from '@lib/i18n/useFormatters';
import { useNavigate } from 'react-router-dom';
import type { BudgetLine } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
}

function frequencyLabel(line: BudgetLine, t: (k: string, opts?: Record<string, unknown>) => string): string {
  switch (line.frequency) {
    case 'weekly': return t('budgetLine.weekly');
    case 'biweekly': return t('budgetLine.biweekly');
    case 'semi_monthly': return t('budgetLine.semiMonthly');
    case 'twice_monthly': return t('budgetLine.twiceMonthly');
    case 'monthly': return t('budgetLine.monthly');
    case 'annually': return t('budgetLine.annually');
    case 'one_time': return t('budgetLine.oneTime');
    case 'every_n_days':
      return t('budgetLine.everyNDaysFull', { count: line.frequencyInterval ?? 'N' });
  }
}

export function AnnualBudgetReviewDialog({ open, onClose }: Props) {
  const { t } = useTranslation();
  const { currency } = useFormatters();
  const navigate = useNavigate();
  const { data: allLines = [] } = useBudgetLines();
  const { mutate: complete, isPending: isCompleting } = useMarkBudgetReviewComplete();

  // Only show active flexible expense lines — these are the ones that may drift out of date
  const lines = allLines.filter((l) => l.isActive && l.classification === 'expense');

  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const [edited, setEdited] = useState<Set<string>>(new Set());

  const allReviewed = lines.every((l) => confirmed.has(l.id) || edited.has(l.id));

  function handleConfirm(id: string) {
    setConfirmed((prev) => new Set(prev).add(id));
  }

  function handleEdit(id: string) {
    // Mark as reviewed and navigate to the budget page so the user can edit
    setEdited((prev) => new Set(prev).add(id));
    navigate('/budget');
    onClose();
  }

  function handleDone() {
    complete(undefined, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('budget.reviewDialog.title')}</DialogTitle>
          <DialogDescription>{t('budget.reviewDialog.description')}</DialogDescription>
        </DialogHeader>

        {lines.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            {t('budget.reviewDialog.noLines')}
          </div>
        ) : (
          <div className="overflow-auto flex-1 min-h-0">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-background">
                <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="text-left py-2 pr-4 font-medium">{t('budget.reviewDialog.lineColumn')}</th>
                  <th className="text-right py-2 pr-4 font-medium">{t('budget.reviewDialog.amountColumn')}</th>
                  <th className="text-left py-2 pr-4 font-medium">{t('budget.reviewDialog.frequencyColumn')}</th>
                  <th className="text-right py-2 font-medium">{t('budget.reviewDialog.actionColumn')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lines.map((line) => {
                  const isConfirmed = confirmed.has(line.id) || edited.has(line.id);
                  return (
                    <tr
                      key={line.id}
                      className={`transition-colors ${isConfirmed ? 'bg-success/5' : 'hover:bg-muted/30'}`}
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{line.name}</span>
                          {line.flexibility === 'flexible' && (
                            <Badge variant="secondary" className="text-xs py-0">
                              {t('budgetLine.flexible')}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-right text-foreground font-medium">
                        {currency(line.amount)}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {frequencyLabel(line, t)}
                      </td>
                      <td className="py-3 text-right">
                        {isConfirmed ? (
                          <span className="inline-flex items-center gap-1 text-success text-xs font-medium">
                            <Check className="h-3.5 w-3.5" />
                            {t('budget.reviewDialog.confirmed')}
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(line.id)}
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {t('budget.reviewDialog.edit')}
                            </button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => handleConfirm(line.id)}
                            >
                              {t('budget.reviewDialog.confirm')}
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {allReviewed && lines.length > 0
              ? t('budget.reviewDialog.allConfirmed')
              : t('budget.reviewDialog.doneHint', {
                  reviewed: confirmed.size + edited.size,
                  total: lines.length,
                })}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleDone}
              disabled={!allReviewed || lines.length === 0 || isCompleting}
            >
              {isCompleting ? t('common.saving') : t('budget.reviewDialog.done')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
