'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';

export default function TicketDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    if (!id) return;
    
    fetch(`http://localhost:4000/api/dev/messages/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTicket(data.message);
        } else {
          alert('Ticket not found');
          router.push('/dev/dashboard');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id, router]);

  const handleStatusChange = async (status: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/dev/messages/${id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        alert(`Ticket status updated to ${status}`);
        setTicket({ ...ticket, status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    try {
      const response = await fetch(`http://localhost:4000/api/dev/messages/${id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reply: replyContent.trim() }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Reply sent successfully');
        setReplyContent('');
        setTicket({ ...ticket, reply: replyContent.trim(), status: 'REPLIED', replied_at: new Date() });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6 text-white">Loading ticket...</div>;
  if (!ticket) return <div className="p-6 text-white">Ticket not found.</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/dev/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            ticket.status === 'PENDING' ? 'bg-amber-900 text-amber-300' : 
            ticket.status === 'READ' ? 'bg-blue-900 text-blue-300' :
            ticket.status === 'REVIEWING' ? 'bg-purple-900 text-purple-300' :
            ticket.status === 'REPLIED' ? 'bg-indigo-900 text-indigo-300' :
            'bg-green-900 text-green-300'
          }`}>
            {ticket.status}
          </span>
        </div>

        {/* Ticket Card */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-700 pb-4">
            <div>
              <h1 className="text-xl font-bold">Ticket #{ticket.id.substring(0, 8)}</h1>
              <p className="text-sm text-slate-400">Submitted on {new Date(ticket.created_at).toLocaleString()}</p>
            </div>
            <MessageSquare className="w-6 h-6 text-slate-500" />
          </div>

          {/* User Info */}
          <div className="bg-slate-700/50 p-4 rounded-xl space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">User:</span>
              <span className="font-semibold">{ticket.user?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Email:</span>
              <span>{ticket.user?.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">User ID:</span>
              <span className="font-mono">{ticket.user_id}</span>
            </div>
          </div>

          {/* Screenshot */}
          {ticket.attachment && (
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Screenshot Proof:</p>
              <img src={ticket.attachment} alt="Screenshot Proof" className="max-w-full rounded-xl border border-slate-700 shadow-lg" />
            </div>
          )}

          {/* Message Content */}
          <div className="space-y-2">
            <p className="text-sm text-slate-400">Issue Description:</p>
            <p className="bg-slate-700/50 p-4 rounded-xl text-slate-200">"{ticket.content}"</p>
          </div>

          {/* Dev Reply */}
          {ticket.reply && (
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Your Reply:</p>
              <div className="bg-slate-700/30 p-4 rounded-xl text-slate-300 border border-slate-700/50">
                <p>"{ticket.reply}"</p>
                <p className="text-xs text-slate-500 mt-2">Replied at: {new Date(ticket.replied_at).toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t border-slate-700 pt-4">
            <div className="flex gap-2">
              {ticket.status === 'PENDING' && (
                <button 
                  onClick={() => handleStatusChange('READ')}
                  className="btn-secondary !py-1.5 !px-3 text-xs"
                >
                  Mark as Read
                </button>
              )}
              {ticket.status === 'READ' && (
                <button 
                  onClick={() => handleStatusChange('REVIEWING')}
                  className="btn-secondary !py-1.5 !px-3 text-xs bg-amber-900/50 hover:bg-amber-900 text-amber-300 border-amber-700"
                >
                  Mark as Reviewing
                </button>
              )}
              {(ticket.status === 'REVIEWING' || ticket.status === 'REPLIED') && (
                <button 
                  onClick={() => handleStatusChange('RESOLVED')}
                  className="btn-secondary !py-1.5 !px-3 text-xs bg-green-900/50 hover:bg-green-900 text-green-300 border-green-700"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>

          {/* Reply Form */}
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Send a Reply:</label>
            <textarea
              placeholder="Type your reply here..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full p-3 text-sm bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:border-slate-500 text-slate-200"
              rows={4}
            />
            <div className="flex justify-end">
              <button
                onClick={handleReply}
                disabled={!replyContent.trim()}
                className="btn-primary !py-2 !px-4 text-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2 inline" />
                Send Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
