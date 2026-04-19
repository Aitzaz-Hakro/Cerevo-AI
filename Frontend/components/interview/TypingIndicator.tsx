export function TypingIndicator() {
  return (
    <div className="mb-4 flex items-end gap-2">
      <div className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900">
        <span className="text-[10px] font-bold text-white">AI</span>
      </div>
      <div className="rounded-2xl rounded-bl-sm border border-gray-100 bg-white px-4 py-3 shadow-sm">
        <div className="flex h-4 items-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
