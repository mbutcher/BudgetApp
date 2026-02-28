import { useTranslation } from 'react-i18next';
import { Tag } from 'lucide-react';

export function TagSummaryWidget() {
  const { t } = useTranslation();

  return (
    <div className="h-full flex flex-col items-center justify-center p-5 gap-3 text-center">
      <div className="rounded-full bg-muted p-3">
        <Tag className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground mb-1">{t('dashboard.tagSummary')}</p>
        <p className="text-xs text-muted-foreground max-w-[200px]">
          {t('dashboard.tagSummaryComingSoon')}
        </p>
      </div>
    </div>
  );
}
