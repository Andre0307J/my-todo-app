import { NextRequest, NextResponse } from 'next/server';
import { pusher } from '@/lib/pusher';

export async function POST(req: NextRequest) {
  try {
    const { message, user } = await req.json();

    // Basic validation
    if (!message || !user) {
      return NextResponse.json({ success: false, error: 'Message and user are required.' }, { status: 400 });
    }

    // Trigger a new message event on the 'chat' channel
    await pusher.trigger('chat-channel', 'new-message', {
      message,
      user,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}