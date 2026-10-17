import { Icon } from "@/components/ui/Icon";

type SummaryCardProps = {
  label: string;
  value: number | string;
  variant: "total" | "completed" | "pending";
  icon: "database" | "check" | "clock";
};

export function SummaryCard({ label, value, variant, icon }: SummaryCardProps) {
  const iconClass = variant === "total" ? "purple-icon" : variant === "completed" ? "green-icon" : "orange-icon";
  return (
    <article className={`summary-card ${variant}-card`}>
      <div className={`summary-icon ${iconClass}`}><Icon name={icon} /></div>
      <div className="summary-copy"><p>{label}</p><strong>{value}</strong></div>
    </article>
  );
}
