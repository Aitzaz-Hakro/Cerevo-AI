import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface RouteContext {
  params: Promise<{ resumeId: string }>;
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { resumeId } = await context.params;
    const { resumeData } = await req.json();

    if (!resumeId || !resumeData) {
      return NextResponse.json(
        { error: 'Missing resumeId or resumeData' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = {
      id: resumeId,
      user_id: user.id,
      title: resumeData.title,
      template_id: resumeData.templateId,
      resume_data: resumeData,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('resumes').upsert(payload, {
      onConflict: 'id',
    });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to save resume', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Resume PATCH error:', error);
    return NextResponse.json({ error: 'Failed to save resume' }, { status: 500 });
  }
}
