'use client';

export function ScorePanel() {
  const scores = [
    { label: 'Keywords', value: 62, color: '#f59e0b' },
    { label: 'Impact', value: 45, color: '#f59e0b' },
    { label: 'Format', value: 91, color: '#10b981' },
    { label: 'Completeness', value: 78, color: '#3b82f6' },
  ];

  return (
    <div className="w-56 shrink-0 border-l bg-gray-50 p-4 overflow-y-auto">
      <h4 className="text-[11px] font-semibold text-gray-700 mb-3">ATS Score</h4>
      <div className="bg-white border rounded-lg p-3 mb-4">
        <p className="text-[10px] text-gray-400 mb-2 font-medium">Resume strength</p>
        {scores.map((score) => (
          <div key={score.label} className="mb-2">
            <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
              <span>{score.label}</span>
              <span>{score.value}%</span>
            </div>
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${score.value}%`, background: score.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <h4 className="text-[11px] font-semibold text-gray-700 mb-2">AI Suggestions</h4>
      <p className="text-[11px] text-gray-400 leading-relaxed">
        Click any section on the canvas to see suggestions here.
      </p>
    </div>
  );
}
