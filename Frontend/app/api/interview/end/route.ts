import { NextRequest, NextResponse } from 'next/server';
import { API_MAP, INTERPREP_BASE } from '@/lib/interview-api';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = body?.sessionId as string | undefined;

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(`${INTERPREP_BASE}${API_MAP.endpoints.endSession(sessionId)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ [API_MAP.requestFields.sessionId]: sessionId }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const bodyText = await response.text().catch(() => '');
      console.error(`[Interprep API] ${response.status} from ${response.url}:`, bodyText);
      return NextResponse.json(
        { error: `Failed to end session: ${response.status}` },
        { status: response.status }
      );
    }

    const data = (await response.json()) as Record<string, unknown>;
    const R = API_MAP.responseFields;

    return NextResponse.json({
      summary: String(data[R.summary] ?? 'Interview complete.'),
      score: Number(data[R.score] ?? 0),
      strengths: Array.isArray(data[R.strengths])
        ? (data[R.strengths] as string[])
        : [],
      improvements: Array.isArray(data[R.improvements])
        ? (data[R.improvements] as string[])
        : [],
    });
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      return NextResponse.json(
        { error: 'Interview service timed out after 60 seconds' },
        { status: 504 }
      );
    }

    console.error('End session error:', error);
    return NextResponse.json({ error: 'Failed to retrieve results' }, { status: 500 });
  }
}
