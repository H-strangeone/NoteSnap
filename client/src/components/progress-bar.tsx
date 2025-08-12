interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({ 
  progress, 
  className = "", 
  showPercentage = true 
}: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  const getProgressColor = (progress: number) => {
    if (progress < 25) return "bg-red-500";
    if (progress < 50) return "bg-amber-500";
    if (progress < 75) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className={className}>
      {showPercentage && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-600">Progress</span>
          <span className="font-medium text-slate-900">{clampedProgress}%</span>
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 progress-bar ${getProgressColor(clampedProgress)}`}
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>
    </div>
  );
}
