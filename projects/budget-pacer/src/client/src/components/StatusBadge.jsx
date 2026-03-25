const statusConfig = {
  green: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    label: 'On Track',
  },
  yellow: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    label: 'Warning',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    dot: 'bg-red-500',
    label: 'Critical',
  },
};

function StatusBadge({ status, size = 'sm' }) {
  const config = statusConfig[status] || statusConfig.green;
  const sizeClasses = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function StatusDot({ status }) {
  const config = statusConfig[status] || statusConfig.green;
  return <span className={`inline-block w-3 h-3 rounded-full ${config.dot}`} title={config.label} />;
}

export default StatusBadge;
