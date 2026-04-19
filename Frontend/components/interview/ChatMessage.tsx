import { cn } from '@/lib/utils';
import { ChatMessage as ChatMessageType } from '@/types/interview';

interface Props {
  message: ChatMessageType;
}

export function ChatMessage({ message }: Props) {
  const isAI = message.role === 'ai' || message.role === 'system';
  const isUser = message.role === 'user';
  const isFeedback = message.role === 'feedback';

  if (isFeedback) {
    return (
      <div className="mb-4 flex justify-center">
        <div className="w-full max-w-md rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-500">
              Feedback
            </span>
          </div>
          <p className="text-sm leading-relaxed text-blue-800">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('mb-4 flex items-end gap-2', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
          isAI ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
        )}
      >
        {isAI ? 'AI' : 'You'}
      </div>

      <div
        className={cn(
          'max-w-[75%] px-4 py-3 text-sm leading-relaxed shadow-sm',
          isAI
            ? 'rounded-2xl rounded-bl-sm border border-gray-100 bg-white text-gray-800'
            : 'rounded-2xl rounded-br-sm bg-gray-900 text-white'
        )}
      >
        {message.questionNumber && isAI && (
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Question {message.questionNumber}
          </div>
        )}
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div className="mt-1.5 text-[10px] text-gray-400">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
