import { useI18n } from "../../../shared/i18n/useI18n";
import type { TaskDto } from "../../../shared/types";

interface SummaryCardsProps {
  readonly tasks: readonly TaskDto[];
}

function SummaryCards({ tasks }: SummaryCardsProps) {
  const { t } = useI18n();

  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const pending = total - done;
  const percentDone = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="summary-card__value">{total}</div>
        <div className="summary-card__label">{t("tasks.stats.total")}</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__value">{done}</div>
        <div className="summary-card__label">{t("tasks.stats.done")}</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__value">{pending}</div>
        <div className="summary-card__label">{t("tasks.stats.pending")}</div>
      </div>
      <div className="summary-card summary-card--progress">
        <div className="summary-card__progress-info">
          <span className="summary-card__value">{percentDone}%</span>
        </div>
        <div className="summary-card__progress-bar-container">
          <div
            className="summary-card__progress-bar-fill"
            style={{ width: `${percentDone}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;
