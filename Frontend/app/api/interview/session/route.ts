import { NextRequest, NextResponse } from 'next/server';
import { API_MAP, INTERPREP_BASE } from '@/lib/interview-api';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeText } = body as { resumeText?: string };

    if (!resumeText?.trim()) {
      return NextResponse.json({ error: 'Resume content is required' }, { status: 400 });
    }

    const payload = new FormData();
    payload.append(
      API_MAP.requestFields.resumeFile,
      new Blob([resumeText], { type: 'text/plain' }),
      'resume.txt'
    );
    payload.append(API_MAP.requestFields.resumeText, resumeText);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(`${INTERPREP_BASE}${API_MAP.endpoints.createSession}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: payload,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const bodyText = await response.text().catch(() => '');
      console.error(`[Interprep API] ${response.status} from ${response.url}:`, bodyText);
      return NextResponse.json(
        { error: `Interview service error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = (await response.json()) as Record<string, unknown>;
    const R = API_MAP.responseFields;
    const firstMessage =
      data[R.firstMessage] ?? data.message ?? data.question ?? data.next_question ?? data.response;

    return NextResponse.json({
      sessionId: String(data[R.sessionId] ?? data.session_id ?? data.session ?? 'single-session'),
      firstMessage: String(firstMessage ?? 'Interview started.'),
      totalQuestions: Number(data[R.totalQuestions] ?? 10),
    });
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      return NextResponse.json(
        { error: 'Interview service timed out after 60 seconds' },
        { status: 504 }
      );
    }

    console.error('Session creation error:', error);
    return NextResponse.json({ error: 'Failed to start interview session' }, { status: 500 });
  }
}
