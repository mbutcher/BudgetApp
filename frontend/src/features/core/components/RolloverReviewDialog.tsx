import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { useRolloverSummary } from '../hooks/useBudgetLines';
import { useAcknowledgeRollover } from '@features/dashboard/hooks/useDashboardConfig';
import { useFormatters } from '@lib/i18n/useFormatters';
import type { RolloverLine } from '../types';

interface Props {
  previousStart: string;
  previousEnd: string;
  open: boolean;
  onClose: () => void;
}

function VarianceCell({ line }: { line: RolloverLine }) {
  const { currency } = useFormatters();
  const isUnderspent = line.variance > 0;
  const isOver = line.variance < 0;

  return (
    <div className={`flex items-center gap-1 text-sm font-medium ${isUnderspent ? 'text-success' : isOver ? 'text-destructive' : 'text-muted-foreground'}`}>
      {isUnderspent ? (
        <TrendingUp className="h-3.5 w-3.5" />
      ) : isOver ? (
        <TrendingDown className="h-3.5 w-3.5" />
      ) : (
        <Minus className="h-3.5 w-3.5" />
      )}
      {isUnderspent ? '+' : ''}{currency(line.variance)}
    </div>
  );
}

export function RolloverReviewDialog({ previousStart, previousEnd, open, onClose }: Props) {
  const { t } = useTranslation();
  const { currency } = useFormatters();
  const { data: summary, isLoading } = useRolloverSummary(
    open ? previousStart : null,
    open ? previousEnd : null,
  );
  const { mutate: acknowledge, isPending: isAcknowledging } = useAcknowledgeRollover();
  const [dismissed, setDismissed] = useState(false);

  function handleAcknowledge() {
    acknowledge(
      { previousStart, previousEnd },
      {
        onSuccess: () => {
          setDismissed(true);
          onClose();
        },
      },
    );
  }

  const lines = summary?.flexibleLines ?? [];
  const totalVariance = (summary?.totalProratedFlexible ?? 0) - (summary?.totalActualFlexible ?? 0);

  return (
    <Dialog open={open && !dismissed} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('budget.rolloverDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('budget.rolloverDialog.description', {
              start: previousStart,
              end: previousEnd,
            })}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            {t('common.loading', 'Loading…')}
          </div>
        ) : lines.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            {t('budget.rolloverDialog.noFlexibleLines')}
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="text-left py-2 pr-4 font-medium">{t('budget.rolloverDialog.lineColumn')}</th>
                  <th className="text-right py-2 pr-4 font-medium">{t('budget.rolloverDialog.proratedColumn')}</th>
                  <th className="text-right py-2 pr-4 font-medium">{t('budget.rolloverDialog.actualColumn')}</th>
                  <th className="text-right py-2 font-medium">{t('budget.rolloverDialog.varianceColumn')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lines.map((line) => (
                  <tr key={line.budgetLineId} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 pr-4 font-medium text-foreground">{line.name}</td>
                    <td className="py-3 pr-4 text-right text-muted-foreground">{currency(line.proratedAmount)}</td>
                    <td className="py-3 pr-4 text-right text-muted-foreground">{currency(line.actualAmount)}</td>
                    <td className="py-3 text-right">
                      <VarianceCell line={line} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border font-semibold">
                  <td className="py-3 pr-4 text-foreground">{t('budget.rolloverDialog.total')}</td>
                  <td className="py-3 pr-4 text-right text-muted-foreground">{currency(summary?.totalProratedFlexible ?? 0)}</td>
                  <td className="py-3 pr-4 text-right text-muted-foreground">{currency(summary?.totalActualFlexible ?? 0)}</td>
                  <td className="py-3 text-right">
                    <span className={`text-sm font-semibold ${totalVariance > 0 ? 'text-success' : totalVariance < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {totalVariance > 0 ? '+' : ''}{currency(totalVariance)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>
            {t('budget.rolloverDialog.dismiss')}
          </Button>
          <Button onClick={handleAcknowledge} disabled={isAcknowledging || isLoading}>
            {isAcknowledging ? t('common.saving') : t('budget.rolloverDialog.markReviewed')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
