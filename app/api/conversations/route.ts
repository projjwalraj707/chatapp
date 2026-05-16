import { NextResponse } from 'next/server';
import { getConversations } from '@/app/lib/db/dbQueries';

export async function GET() {
  try {
    const conversations = await getConversations();
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Unable to load conversations' }, { status: 500 });
  }
}
