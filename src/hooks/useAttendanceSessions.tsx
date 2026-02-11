import { useState, useEffect, useMemo } from "react";
import api from "../service/api";
import type { AttendanceSession, AttendanceRecord } from "../types/attendance";

export function useAttendanceSessions() {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<AttendanceSession | null>(null);

  const fetchSessions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sRes, aRes] = await Promise.all([
        api.get("/sessions"),
        api.get("/attendances")
      ]);

      const sessionsData = Array.isArray(sRes.data) ? sRes.data : (sRes.data?.sessions ?? []);
      const attendancesData = Array.isArray(aRes.data) ? aRes.data : (aRes.data?.attendances ?? []);

      setSessions(sessionsData);
      setAttendances(attendancesData);
      setCurrentSession(sessionsData.length > 0 ? sessionsData[0] : null);
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || "Failed to fetch sessions";
      setError(message);
      setSessions([]);
      setAttendances([]);
      setCurrentSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const createNewSession = async () => {
    try {
      const res = await api.post("/sessions", {
        expires_in_minutes: 30, // Temp QR expires in 30 minutes
      }, { withCredentials: true });
      const newSession = res.data;
      setSessions([newSession, ...sessions]);
      setCurrentSession(newSession);
      return newSession;
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || "Failed to create session";
      setError(message);
      throw err;
    }
  };

  const sessionWithAttendances = useMemo(() => {
    if (!currentSession) return null;
    return {
      ...currentSession,
      attendances: attendances.filter((a) => a.session_id === currentSession.id),
    };
  }, [currentSession, attendances]);

  return {
    sessions,
    attendances,
    isLoading,
    error,
    currentSession,
    sessionWithAttendances,
    createNewSession,
    refresh: fetchSessions,
  };
}
