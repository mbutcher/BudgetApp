import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAccounts } from '@features/core/hooks/useAccounts';
import { WIDGET_META } from '../widgetRegistry';
import type { DashboardConfig, WidgetCategory, WidgetId } from '../types/dashboard';

interface Props {
  config: DashboardConfig;
  onToggleWidget: (id: WidgetId, enabled: boolean) => void;
  onToggleAccount: (accountId: string, excluded: boolean) => void;
  onClose: () => void;
}

const CATEGORY_ORDER: WidgetCategory[] = ['overview', 'budgeting', 'savings', 'spending', 'debt'];

export function WidgetTray({ config, onToggleWidget, onToggleAccount, onClose }: Props) {
  const { t } = useTranslation();
  const { data: accounts = [] } = useAccounts();
  const activeAccounts = accounts.filter((a) => a.isActive);

  // Group widgets by category, skipping feature-flagged ones
  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    label: t(`dashboard.widgetCategories.${cat}`),
    items: WIDGET_META.filter((m) => m.category === cat && !m.featureFlag),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 bg-card border-l border-border shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
        <h2 className="text-base font-semibold text-foreground">{t('dashboard.editDashboard')}</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Widget toggles — grouped by category */}
        <div className="px-5 py-4 border-b border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            {t('dashboard.widgets.title')}
          </p>
          <div className="space-y-5">
            {grouped.map(({ cat, label, items }) => (
              <div key={cat}>
                <p className="text-xs font-semibold text-muted-foreground mb-2">{label}</p>
                <div className="space-y-2.5">
                  {items.map((meta) => {
                    const enabled = config.widgetVisibility[meta.id] ?? false;
                    return (
                      <label
                        key={meta.id}
                        className={`flex items-center justify-between ${meta.alwaysOn ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span className="text-sm text-foreground">{t(meta.labelKey)}</span>
                        <input
                          type="checkbox"
                          checked={enabled}
                          disabled={meta.alwaysOn}
                          onChange={(e) => onToggleWidget(meta.id, e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account filter */}
        {activeAccounts.length > 0 && (
          <div className="px-5 py-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              {t('dashboard.accountFilter')}
            </p>
            <p className="text-xs text-muted-foreground mb-3">{t('dashboard.accountFilterHint')}</p>
            <div className="space-y-3">
              {activeAccounts.map((acct) => {
                const excluded = config.excludedAccountIds.includes(acct.id);
                return (
                  <label key={acct.id} className="flex items-center justify-between cursor-pointer">
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">{acct.name}</p>
                      {acct.institution && (
                        <p className="text-xs text-muted-foreground truncate">{acct.institution}</p>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={!excluded}
                      onChange={(e) => onToggleAccount(acct.id, !e.target.checked)}
                      className="ml-3 rounded border-border text-primary focus:ring-primary flex-shrink-0"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
