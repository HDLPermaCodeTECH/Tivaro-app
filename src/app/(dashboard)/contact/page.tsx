'use client';

import { useState, useEffect, Fragment } from 'react';
import { api } from '@/lib/api';
import { MessageSquare, Send, Loader2, Paperclip } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [attachment, setAttachment] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const session = api.auth.getSession();
    if (session) {
      setUser(session.user);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:4000/api/dev/messages/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setMessages(data.messages);
        });
    }
  }, [user]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setAttachment(reader.result as string);
                toast.success('Image pasted from clipboard!');
              };
              reader.readAsDataURL(file);
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/dev/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id,
          content: content.trim(),
          attachment: attachment,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Message sent successfully!');
        setContent('');
        setAttachment(null);
        // Refresh messages
        fetch(`http://localhost:4000/api/dev/messages/user/${user?.id}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) setMessages(data.messages);
          });
      } else {
        toast.error('Failed to send message.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const hasActiveTicket = messages.some(msg => msg.status !== 'RESOLVED');
  const activeTicket = messages.find(msg => msg.status !== 'RESOLVED');

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10 animate-in fade-in duration-500 h-[calc(100vh-120px)] flex flex-col">
      <div className="space-y-1 flex-shrink-0">
        <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">Support Center</h1>
        <p className="text-muted-foreground font-medium">Professional help desk and ticketing system.</p>
      </div>

      {!hasActiveTicket ? (
        // Ticket Creation Form
        <div className="card !p-8 flex flex-col flex-1 overflow-y-auto border border-border/50 shadow-2xl shadow-black/5 bg-background space-y-6">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold">Submit a Ticket</h2>
              <p className="text-xs text-muted-foreground">Please fill in the details below. All fields are required.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Full Name</label>
              <input type="text" value={user?.name || ''} readOnly className="w-full p-3 text-sm border border-border rounded-xl bg-muted cursor-not-allowed" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Email Address</label>
              <input type="text" value={user?.email || ''} readOnly className="w-full p-3 text-sm border border-border rounded-xl bg-muted cursor-not-allowed" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">User ID</label>
            <input type="text" value={user?.id || ''} readOnly className="w-full p-3 text-sm border border-border rounded-xl bg-muted font-mono cursor-not-allowed" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Describe your issue</label>
            <textarea
              placeholder="Please describe the problem you are facing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary/50 bg-background min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Screenshot Proof (Required)</label>
            <div className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                required
              />
              {attachment ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={attachment} alt="Preview" className="max-w-xs max-h-40 object-cover rounded-lg" />
                  <span className="text-xs text-muted-foreground">Image selected. Click again to change.</span>
                </div>
              ) : (
                <>
                  <Paperclip className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm font-medium">Click or drag image to upload</span>
                  <span className="text-xs text-muted-foreground">PNG, JPG up to 5MB</span>
                </>
              )}
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={loading || !content.trim() || !attachment}
            className="btn-primary !py-3 w-full flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit Ticket
              </>
            )}
          </button>
        </div>
      ) : (
        // Active Ticket View (Messenger Style)
        <div className="card !p-0 flex flex-col flex-1 overflow-hidden border border-border/50 shadow-2xl shadow-black/5 bg-background">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/50 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-background rounded-full ${activeTicket?.status === 'PENDING' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
              </div>
              <div>
                <h2 className="text-sm font-bold font-display">Ticket #{activeTicket?.id.substring(0, 8)}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  activeTicket?.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                  activeTicket?.status === 'READ' ? 'bg-blue-100 text-blue-700' :
                  activeTicket?.status === 'REVIEWING' ? 'bg-purple-100 text-purple-700' :
                  activeTicket?.status === 'REPLIED' ? 'bg-indigo-100 text-indigo-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {activeTicket?.status}
                </span>
              </div>
            </div>
            <div className="text-xs text-amber-500 font-medium bg-amber-500/10 px-2 py-1 rounded-full">
              You have an active ticket
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 flex flex-col">
            {messages.slice().reverse().map((msg) => (
              <Fragment key={msg.id}>
                {/* Admin Message (Right) */}
                <div className="flex justify-end">
                  <div className="max-w-[70%] bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-none shadow-sm space-y-1">
                    {msg.attachment && (
                      <img src={msg.attachment} alt="Attachment" className="max-w-full rounded-lg mb-2 border border-white/20" />
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-[10px] opacity-70 block text-right">
                      {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                </div>

                {/* Support Reply (Left) */}
                {msg.reply && (
                  <div className="flex justify-start">
                    <div className="max-w-[70%] bg-muted p-3 rounded-2xl rounded-tl-none shadow-sm space-y-1">
                      <p className="text-sm text-foreground">{msg.reply}</p>
                      <span className="text-[10px] text-muted-foreground block">
                        {msg.replied_at ? new Date(msg.replied_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  </div>
                )}
              </Fragment>
            ))}
          </div>

          {/* Locked Footer */}
          <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-xl flex justify-center items-center text-muted-foreground text-sm">
            <span className="font-medium">You cannot send messages while a ticket is active. Please wait for the developer to resolve it.</span>
          </div>
        </div>
      )}
    </div>
  );
}
