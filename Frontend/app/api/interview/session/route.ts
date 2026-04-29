import { NextRequest, NextResponse } from 'next/server';
import { API_MAP, INTERPREP_BASE } from '@/lib/interview-api';

export async function POST(req: NextRequest) {
  try {
    const requestFormData = await req.formData();
    const cvFile = requestFormData.get('cv');
    const resumeText = requestFormData.get('resume_text');

    const file = cvFile instanceof File ? cvFile : null;
    const text = typeof resumeText === 'string' ? resumeText.trim() : '';

    if (!file && !text) {
      return NextResponse.json({ error: 'Resume content is required.' }, { status: 400 });
    }

    if (file && file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'That file is too large. Please upload a CV under 10MB.' },
        { status: 413 }
      );
    }

    if (file) {
      const validMime =
        file.type === 'application/pdf' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const validExtension = /\.(pdf|docx)$/i.test(file.name);

      if (!validMime && !validExtension) {
        return NextResponse.json({ error: 'Please upload a PDF or DOCX file.' }, { status: 415 });
      }
    }

    const payload = new FormData();

    if (file) {
      payload.append(API_MAP.requestFields.resumeFile, file, file.name);
    }

    if (text) {
      payload.append(API_MAP.requestFields.resumeText, text);
    }

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
      data.question ?? data[R.firstMessage] ?? data.message ?? data.next_question ?? data.response;

    return NextResponse.json({
      sessionId: String(data[R.sessionId] ?? data.session_id ?? data.session ?? 'single-session'),
      question: String(firstMessage ?? 'Tell me about yourself.'),
      firstMessage: String(firstMessage ?? 'Interview started.'),
      totalQuestions: Number(data[R.totalQuestions] ?? 10),
      done: Boolean(data.done ?? data[R.isComplete] ?? false),
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
