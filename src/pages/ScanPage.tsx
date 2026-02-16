import { useState, useEffect } from "react";
import { useAttendanceSessions } from "../hooks/useAttendanceSessions";
import { RefreshCw, QrCode } from "lucide-react";

export default function ScanPage() {
  const { currentSession, sessionWithAttendances, refresh } = useAttendanceSessions();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!currentSession) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expires = new Date(currentSession.expires_at).getTime();
      const diff = Math.max(0, Math.floor((expires - now) / 1000));
      setTimeLeft(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [currentSession]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!currentSession) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="text-center">
          <p className="text-lg text-slate-600">No active session</p>
          <button
            onClick={refresh}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900">Attendance Check-In</h1>
          <p className="text-slate-600 mt-2">Scan the QR code to register your attendance</p>
        </div>

        {/* Session Status */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-indigo-200">
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">
              Session Active
            </span>
          </div>

          <div className="text-center mb-8">
            <p className="text-slate-600 text-sm mb-2">Time Remaining</p>
            <p className="text-5xl font-bold text-indigo-600 font-mono">
              {timeLeft !== null ? formatTime(timeLeft) : "Loading..."}
            </p>
          </div>
        </div>

        {/* QR Codes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* On-Time QR */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-emerald-200">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <QrCode size={48} className="text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">On-Time Entry</h2>
              <p className="text-sm text-slate-600 mb-6">Scan before expiration</p>
              <div className="bg-slate-50 rounded-2xl p-6 font-mono text-sm text-slate-700 break-all border border-slate-200">
                {currentSession.qr_code_temp}
              </div>
              <p className="text-xs text-emerald-600 font-bold mt-4">TEMPORARY - EXPIRES SOON</p>
            </div>
          </div>

          {/* Late QR */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-amber-200">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-amber-100 rounded-2xl flex items-center justify-center">
                <QrCode size={48} className="text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Late Entry</h2>
              <p className="text-sm text-slate-600 mb-6">For latecomers</p>
              <div className="bg-slate-50 rounded-2xl p-6 font-mono text-sm text-slate-700 break-all border border-slate-200">
                {currentSession.qr_code_static}
              </div>
              <p className="text-xs text-amber-600 font-bold mt-4">PERMANENT - ALWAYS AVAILABLE</p>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={refresh}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw size={20} />
          Refresh Session
        </button>

        {/* Current Attendance Count */}
        {sessionWithAttendances && (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Today's Check-ins</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <p className="text-sm text-emerald-600 font-bold">On Time</p>
                <p className="text-3xl font-bold text-emerald-700 mt-2">
                  {sessionWithAttendances.attendances.filter((a) => !a.is_late).length}
                </p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <p className="text-sm text-amber-600 font-bold">Late</p>
                <p className="text-3xl font-bold text-amber-700 mt-2">
                  {sessionWithAttendances.attendances.filter((a) => a.is_late).length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
