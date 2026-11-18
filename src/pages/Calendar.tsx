import React, { useState, useEffect, useMemo } from 'react';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth,
  isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Flame, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useUserData } from '../hooks/useFirebaseData';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Session } from '../types';

export const Calendar: React.FC = () => {
  const { currentUser } = useAuth();
  const { userData } = useUserData();

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [allSessions, setAllSessions] = useState<Session[]>([]);

  // Listen to user's completed sessions
  useEffect(() => {
    if (!currentUser) {
      setAllSessions([]);
      return;
    }

    const q = query(
      collection(db, `users/${currentUser.uid}/sessions`),
      where('completed', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => doc.data() as Session);
      setAllSessions(docs);
    }, (err) => {
      console.error('Error fetching sessions in calendar:', err);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Generate calendar days for the current view
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  // Map sessions by date string
  const sessionsByDate = useMemo(() => {
    const map = new Map<string, Session[]>();
    allSessions.forEach(session => {
      const existing = map.get(session.date) || [];
      existing.push(session);
      map.set(session.date, existing);
    });
    return map;
  }, [allSessions]);

  // Metrics for current month
  const monthStats = useMemo(() => {
    const currentMonthStr = format(currentMonth, 'yyyy-MM');
    let monthSessionsCount = 0;
    const activeDaysSet = new Set<string>();

    allSessions.forEach(s => {
      if (s.date && s.date.startsWith(currentMonthStr)) {
        monthSessionsCount++;
        activeDaysSet.add(s.date);
      }
    });

    return {
      activeDays: activeDaysSet.size,
      totalSessions: monthSessionsCount
    };
  }, [allSessions, currentMonth]);

  // Selected date's sessions
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const selectedSessions = sessionsByDate.get(selectedDateStr) || [];
  const pratahCompleted = selectedSessions.some(s => s.type === 'pratah');
  const madhyahnikaCompleted = selectedSessions.some(s => s.type === 'madhyahnika');
  const sayamCompleted = selectedSessions.some(s => s.type === 'sayam');

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 pb-28 font-sans">
      
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-extrabold tracking-wider uppercase mb-1 border border-orange-200/60">
            <Sparkles className="w-3 h-3" /> பயணக் குறிப்பு
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#191815] tracking-tight">
            My Journey
          </h1>
          <p className="text-xs text-gray-500">
            தினசரி அனுஷ்டானத் தொடர்ச்சி & மாதக் குறிப்பு
          </p>
        </div>

        {/* Current Streak Capsule */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-orange-200 shadow-sm">
          <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
          <span className="text-xs font-black text-orange-600">
            {userData?.currentStreak || 0} நாட்கள்
          </span>
        </div>
      </div>

      {/* ── Monthly Summary Stats Grid ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100 shadow-[0_4px_20px_rgba(255,107,0,0.04)]">
          <p className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider mb-0.5">
            இம்மாத்தில் அனுஷ்டித்த நாட்கள்
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-display font-black text-[#191815]">
              {monthStats.activeDays}
            </span>
            <span className="text-xs text-gray-400 font-bold">நாட்கள்</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100 shadow-[0_4px_20px_rgba(255,107,0,0.04)]">
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-0.5">
            இம்மாத மொத்த வேளைகள்
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-display font-black text-[#191815]">
              {monthStats.totalSessions}
            </span>
            <span className="text-xs text-orange-600 font-bold">அமர்வுகள்</span>
          </div>
        </div>
      </div>

      {/* ── Interactive Monthly Calendar Card ── */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-orange-100 shadow-[0_10px_35px_rgba(255,107,0,0.06)] space-y-4 w-full">
        
        {/* Month Selector Controls */}
        <div className="flex items-center justify-between pb-2 border-b border-orange-100">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 active:scale-95 transition-all"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <h2 className="text-base sm:text-lg font-display font-black text-[#191815]">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>

          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 active:scale-95 transition-all"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <span key={d} className="text-[11px] font-extrabold text-gray-400 uppercase">
              {d.charAt(0)}
            </span>
          ))}
        </div>

        {/* Calendar Grid of Dates */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {calendarDays.map((day, idx) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const daySessions = sessionsByDate.get(dateStr) || [];
            const count = daySessions.length;
            const inCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentDay = isToday(day);

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-1 relative transition-all touch-manipulation active:scale-95 ${
                  !inCurrentMonth
                    ? 'opacity-25 text-gray-400'
                    : isSelected
                      ? 'bg-gradient-to-tr from-orange-500 to-orange-600 text-white font-black shadow-md shadow-orange-500/30 ring-2 ring-orange-300'
                      : isCurrentDay
                        ? 'bg-orange-50 border-2 border-orange-500 text-orange-700 font-extrabold'
                        : count > 0
                          ? 'bg-orange-50/70 border border-orange-200 text-[#191815] font-bold'
                          : 'hover:bg-gray-50 text-gray-700 font-medium'
                }`}
              >
                <span className="text-xs sm:text-sm leading-none">
                  {format(day, 'd')}
                </span>

                {/* Session Completion Indicator Dots */}
                {count > 0 && (
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: Math.min(3, count) }).map((_, dotIdx) => (
                      <span
                        key={dotIdx}
                        className={`w-1 h-1 rounded-full ${
                          isSelected ? 'bg-white' : 'bg-orange-500'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* ── Selected Day Detail Card ── */}
      <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-[0_4px_20px_rgba(255,107,0,0.04)] space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-orange-600" />
            <h3 className="font-display font-extrabold text-sm text-[#191815]">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
          </div>
          <span className="text-xs font-black text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
            {selectedSessions.length}/3 முடிந்தது
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Pratah */}
          <div className={`p-3 rounded-2xl border text-center transition-all ${
            pratahCompleted
              ? 'bg-orange-50/70 border-orange-200 text-orange-800'
              : 'bg-[#FAFAFA] border-gray-100 text-gray-400'
          }`}>
            <span className="text-base">🌅</span>
            <p className="text-xs font-extrabold mt-1">பிராத சந்தியா</p>
            <p className="text-[10px] mt-0.5 font-bold">
              {pratahCompleted ? '✓ முடிந்தது' : 'Pending'}
            </p>
          </div>

          {/* Madhyahnikam */}
          <div className={`p-3 rounded-2xl border text-center transition-all ${
            madhyahnikaCompleted
              ? 'bg-orange-50/70 border-orange-200 text-orange-800'
              : 'bg-[#FAFAFA] border-gray-100 text-gray-400'
          }`}>
            <span className="text-base">☀️</span>
            <p className="text-xs font-extrabold mt-1">மாத்யானிகம்</p>
            <p className="text-[10px] mt-0.5 font-bold">
              {madhyahnikaCompleted ? '✓ முடிந்தது' : 'Pending'}
            </p>
          </div>

          {/* Sayam */}
          <div className={`p-3 rounded-2xl border text-center transition-all ${
            sayamCompleted
              ? 'bg-orange-50/70 border-orange-200 text-orange-800'
              : 'bg-[#FAFAFA] border-gray-100 text-gray-400'
          }`}>
            <span className="text-base">🌙</span>
            <p className="text-xs font-extrabold mt-1">சாயம் சந்தியா</p>
            <p className="text-[10px] mt-0.5 font-bold">
              {sayamCompleted ? '✓ முடிந்தது' : 'Pending'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
