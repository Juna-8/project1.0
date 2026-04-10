import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '../types';
import { cn } from '../lib/utils';

interface CalendarViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  bookmarks: string[];
}

export default function CalendarView({ events, onEventClick, bookmarks }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), day));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          {format(currentDate, 'yyyy년 M월', { locale: ko })}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
          <div key={day} className={cn(
            "text-center text-[10px] font-bold py-1",
            i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400"
          )}>
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Padding for start of month */}
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`pad-${i}`} className="aspect-square" />
        ))}

        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div 
              key={day.toString()} 
              className={cn(
                "aspect-square relative flex flex-col items-center justify-center rounded-lg transition-colors",
                isToday ? "bg-ewha-green text-white" : "hover:bg-gray-50"
              )}
            >
              <span className={cn(
                "text-xs font-medium",
                !isToday && day.getDay() === 0 ? "text-red-500" : 
                !isToday && day.getDay() === 6 ? "text-blue-500" : ""
              )}>
                {format(day, 'd')}
              </span>
              
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5 mt-1">
                  {dayEvents.slice(0, 3).map((event, i) => {
                    const isBookmarked = bookmarks.includes(event.id);
                    return (
                      <div 
                        key={i} 
                        className={cn(
                          "w-1 h-1 rounded-full",
                          isToday ? "bg-white" : isBookmarked ? "bg-green-500" : "bg-ewha-green"
                        )} 
                      />
                    );
                  })}
                </div>
              )}

              {dayEvents.length > 0 && (
                <button 
                  onClick={() => onEventClick(dayEvents[0])}
                  className="absolute inset-0 opacity-0"
                />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">이달의 주요 일정</h3>
        {events
          .filter(e => isSameMonth(new Date(e.date), currentDate))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3)
          .map(event => (
            <div 
              key={event.id}
              onClick={() => onEventClick(event)}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
            >
              <div className="flex flex-col items-center justify-center min-w-[40px] h-10 bg-ewha-light rounded-lg text-ewha-green">
                <span className="text-[10px] font-bold leading-none">{format(new Date(event.date), 'MMM', { locale: ko })}</span>
                <span className="text-sm font-black leading-none">{format(new Date(event.date), 'd')}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{event.title}</p>
                <p className="text-[10px] text-gray-400">{event.category} • {event.location}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
