import React from 'react';
import { Event, Review } from '../types';
import { ArrowLeft, Calendar, MapPin, Share2, Bookmark, ExternalLink, MessageCircle, Heart, User } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface EventDetailProps {
  event: Event;
  reviews: Review[];
  onBack: () => void;
  isBookmarked: boolean;
  onBookmarkToggle: (id: string) => void;
  onAddReview: (content: string) => void;
}

export default function EventDetail({ 
  event, 
  reviews, 
  onBack, 
  isBookmarked, 
  onBookmarkToggle,
  onAddReview
}: EventDetailProps) {
  const [reviewText, setReviewText] = React.useState('');
  const dateObj = new Date(event.date);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    onAddReview(reviewText);
    setReviewText('');
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Share2 size={20} />
          </button>
          <button 
            onClick={() => onBookmarkToggle(event.id)}
            className={cn(
              "p-2 rounded-full transition-colors",
              isBookmarked ? "text-ewha-green" : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full aspect-[16/9] bg-gray-200">
        <img 
          src={event.imageUrl || `https://picsum.photos/seed/${event.id}/1200/800`}
          alt={event.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="px-5 py-6">
        <div className="flex gap-2 mb-3">
          <span className="bg-ewha-green/10 text-ewha-green text-xs font-bold px-2 py-1 rounded">
            {event.category}
          </span>
          <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">
            {event.field}
          </span>
        </div>

        <h1 className="text-2xl font-bold leading-tight mb-4">{event.title}</h1>

        <div className="space-y-3 mb-8">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-50 rounded-lg text-ewha-green">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">일시</p>
              <p className="text-sm text-gray-600">{format(dateObj, 'yyyy년 M월 d일 (eee) HH:mm', { locale: ko })}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-50 rounded-lg text-ewha-green">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">장소</p>
              <p className="text-sm text-gray-600">{event.location}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-50 rounded-lg text-ewha-green">
              <User size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">주최</p>
              <p className="text-sm text-gray-600">{event.organizer}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3">행사 소개</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3">상세 정보</h2>
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">참석 대상</p>
              <p className="text-sm">{event.target}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">유의사항</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {event.notices.map((notice, i) => (
                  <li key={i}>{notice}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <a 
          href={event.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-ewha-green text-white py-4 rounded-xl font-bold shadow-lg shadow-ewha-green/20 mb-10"
        >
          신청하러 가기
          <ExternalLink size={18} />
        </a>

        <hr className="border-gray-100 mb-8" />

        {/* Reviews Section */}
        <div id="reviews">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              후기 및 교류
              <span className="text-ewha-green text-sm font-normal">{reviews.length}</span>
            </h2>
          </div>

          <form onSubmit={handleSubmitReview} className="mb-8">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="행사에 대한 생각이나 후기를 남겨주세요."
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ewha-green/20 focus:border-ewha-green transition-all resize-none h-24"
            />
            <div className="flex justify-end mt-2">
              <button type="submit" className="btn-primary py-2 px-6 text-sm">
                작성하기
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="p-4 border border-gray-100 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-ewha-accent rounded-full flex items-center justify-center text-ewha-green font-bold text-xs">
                        {review.userName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{review.userName}</p>
                        <p className="text-[10px] text-gray-400">
                          {format(new Date(review.createdAt), 'yyyy.MM.dd HH:mm')}
                        </p>
                      </div>
                    </div>
                    <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors">
                      <Heart size={14} />
                      <span className="text-xs">{review.likes}</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {review.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
                <MessageCircle size={40} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">아직 작성된 후기가 없습니다.</p>
                <p className="text-xs">첫 번째 후기를 남겨보세요!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
