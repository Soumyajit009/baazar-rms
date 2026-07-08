import { STATUS_STYLES } from "../../data/constants";

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[status] || STATUS_STYLES.Hold}`}>
      {status}
    </span>
  );
}
