import { Plus, Copy, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import type { AttendanceSession } from "../../../types/attendance";

interface SessionsListProps {
  sessions: AttendanceSession[];
  currentSession: AttendanceSession | null;
  onCreateNew: () => Promise<void>;
  isLoading: boolean;
}

export function SessionsList({ sessions, currentSession, onCreateNew, isLoading }: SessionsListProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateNew = async () => {
    try {
      await onCreateNew();
    } catch (err) {
      alert("Failed to create session");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Active Sessions</h2>
        <button
          onClick={handleCreateNew}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-70"
        >
          <Plus size={18} />
          New Session
        </button>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`border rounded-2xl p-6 transition-all ${
              currentSession?.id === session.id
                ? "border-indigo-300 bg-indigo-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">Session #{session.id}</h3>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                      session.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    {session.status === "active" ? (
                      <>
                        <CheckCircle size={14} className="mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <Clock size={14} className="mr-1" />
                        Expired
                      </>
                    )}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Created: {new Date(session.created_at).toLocaleString()}
                </p>
                <p className="text-sm text-slate-500">
                  Expires: {new Date(session.expires_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Temporary QR */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-600 uppercase mb-2">Temporary QR (On-Time)</p>
                <div className="flex items-center justify-between">
                  <code className="text-xs text-slate-700 font-mono break-all">{session.qr_code_temp}</code>
                  <button
                    onClick={() => handleCopy(session.qr_code_temp, session.id)}
                    className="ml-2 p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Copy size={16} className="text-slate-500" />
                  </button>
                </div>
                {copiedId === session.id && <p className="text-xs text-emerald-600 mt-2">Copied!</p>}
              </div>

              {/* Static QR */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-600 uppercase mb-2">Static QR (Late)</p>
                <div className="flex items-center justify-between">
                  <code className="text-xs text-slate-700 font-mono break-all">{session.qr_code_static}</code>
                  <button
                    onClick={() => handleCopy(session.qr_code_static, session.id)}
                    className="ml-2 p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Copy size={16} className="text-slate-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
