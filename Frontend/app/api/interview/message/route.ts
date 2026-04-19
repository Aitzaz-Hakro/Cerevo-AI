import { NextRequest, NextResponse } from 'next/server';
import { API_MAP, INTERPREP_BASE } from '@/lib/interview-api';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, message } = body as { sessionId?: string; message?: string };

    if (!message?.trim()) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    const payload: Record<string, string> = {
      [API_MAP.requestFields.answer]: message,
    };

    if (sessionId?.trim()) {
      payload[API_MAP.requestFields.sessionId] = sessionId;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(`${INTERPREP_BASE}${API_MAP.endpoints.sendMessage}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const bodyText = await response.text().catch(() => '');
      console.error(`[Interprep API] ${response.status} from ${response.url}:`, bodyText);
      return NextResponse.json(
        { error: `Failed to process answer: ${response.status}` },
        { status: response.status }
      );
    }

    const data = (await response.json()) as Record<string, unknown>;
    const R = API_MAP.responseFields;
    const normalizedMessage =
      data[R.message] ?? data.message ?? data.next_question ?? data.question ?? data.response;
    const completeFlag =
      data[R.isComplete] ?? data.is_finished ?? data.completed ?? data.done ?? false;
    const toNumber = (value: unknown, fallback: number) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    };

    return NextResponse.json({
      message: String(normalizedMessage ?? ''),
      questionNumber: toNumber(data[R.questionNumber] ?? data.current_question ?? 1, 1),
      totalQuestions: toNumber(data[R.totalQuestions] ?? data.total ?? 10, 10),
      isComplete: Boolean(completeFlag),
      feedback: data[R.feedback] ? String(data[R.feedback]) : undefined,
      summary: data[R.summary] ? String(data[R.summary]) : undefined,
      score: toNumber(data[R.score], 0),
      strengths: Array.isArray(data[R.strengths]) ? (data[R.strengths] as string[]) : undefined,
      improvements: Array.isArray(data[R.improvements])
        ? (data[R.improvements] as string[])
        : undefined,
    });
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      return NextResponse.json(
        { error: 'Interview service timed out after 60 seconds' },
        { status: 504 }
      );
    }

    console.error('Message send error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
