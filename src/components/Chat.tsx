'use client';

import { useEffect, useState, useRef } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import Pusher from 'pusher-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  user: string;
  message: string;
  timestamp: string;
  id: string; // Add a unique ID for the key
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [user] = useState('Anonymous'); // In a real app, get this from auth
  const [isOpen, setIsOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
      console.error("Pusher environment variables are not set on the client.");
      return;
    }

    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    // Subscribe to the channel
    const channel = pusher.subscribe('chat-channel');

    // Bind to the event
    channel.bind('new-message', (data: Message) => {
      // Add a unique client-side ID for the React key
      const messageWithId = { ...data, id: nanoid() };
      setMessages((prevMessages) => [...prevMessages, messageWithId]);
    });

    // Cleanup on unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to the bottom when a new message arrives
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentMessage, user }),
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optionally, show an error to the user
    } finally {
      setCurrentMessage('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Real-time Chat</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72 w-full pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex flex-col">
                    <div className="text-sm font-bold">{msg.user}</div>
                    <div className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                      {msg.message}
                    </div>
                    <div className="text-xs text-gray-400 self-start mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Type a message..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
              />
              <Button type="submit">Send</Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 shadow-lg"
        >
          <MessageSquare className="w-8 h-8" />
        </Button>
      )}
    </div>
  );
}