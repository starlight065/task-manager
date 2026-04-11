import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useI18n } from "../../../shared/i18n/useI18n";
import type { TaskDto } from "../../../shared/types";

interface PriorityBreakdownChartProps {
  tasks: TaskDto[];
}

const COLORS = {
  high: "#ff4d4f",
  medium: "#faad14",
  low: "#52c41a",
};

function PriorityBreakdownChart({ tasks }: PriorityBreakdownChartProps) {
  const { t } = useI18n();

  const priorityCounts = tasks.reduce(
    (acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    },
    { high: 0, medium: 0, low: 0 } as Record<string, number>
  );

  const data = [
    { name: t("common.priorityLevels.high"), value: priorityCounts.high, key: "high" },
    { name: t("common.priorityLevels.medium"), value: priorityCounts.medium, key: "medium" },
    { name: t("common.priorityLevels.low"), value: priorityCounts.low, key: "low" },
  ].filter(item => item.value > 0);

  if (tasks.length === 0) {
    return <div className="chart-empty">{t("tasks.list.empty")}</div>;
  }

  return (
    <div className="dashboard-chart">
      <h3 className="dashboard-chart__title">{t("tasks.dashboard.priorityBreakdown")}</h3>
      <div className="dashboard-chart__container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.key as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", backgroundColor: "var(--bg-card)" }}
              itemStyle={{ color: "var(--text-primary)" }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: "500" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PriorityBreakdownChart;
