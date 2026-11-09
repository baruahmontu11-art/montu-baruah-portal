import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowLeft, Sparkles, Star, Facebook, MessageSquare } from 'lucide-react';
import { Article, ArticleReview } from '../types';
import { submitArticleReview, fetchArticleReviews } from '../lib/api';

interface ArticlesProps {
  articles: Article[];
  onSuccess: (message: string) => void;
}

export default function Articles({ articles, onSuccess }: ArticlesProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [reviews, setReviews] = useState<ArticleReview[]>([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Load reviews for selected article
  useEffect(() => {
    if (selectedArticle) {
      loadArticleReviews(selectedArticle.id);
    }
  }, [selectedArticle]);

  const loadArticleReviews = async (artId: string) => {
    try {
      const data = await fetchArticleReviews(artId, true);
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle || !reviewName.trim() || !reviewComment.trim()) return;
    setSubmittingReview(true);
    setReviewError('');
    try {
      const success = await submitArticleReview(selectedArticle.id, {
        name: reviewName,
        rating: reviewRating,
        comment: reviewComment
      });
      if (success) {
        onSuccess('Review submitted! It will appear once approved by Montu Baruah.');
        setReviewName('');
        setReviewRating(5);
        setReviewComment('');
      } else {
        setReviewError('Failed to save review. Please check details.');
      }
    } catch (err) {
      setReviewError('Connection error. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const triggerSocialShare = (platform: 'fb' | 'wa' | 'tw', title: string) => {
    const url = window.location.href;
    let shareLink = '';
    const text = `Read this amazing digital guide: "${title}" by Montu Baruah.`;
    if (platform === 'fb') {
      shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    } else if (platform === 'wa') {
      shareLink = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    } else if (platform === 'tw') {
      shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    }
    window.open(shareLink, '_blank');
  };

  return (
    <section id="articles-section" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
         
        {/* If an article is clicked, show its deep reading details */}
        {selectedArticle ? (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/85 p-6 sm:p-10 shadow-lg text-left animate-fade-in">
            {/* Back Button */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition font-bold text-sm mb-8 active:scale-95 border border-slate-200 px-4 py-2 rounded-xl bg-white shadow-sm cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to All Articles
            </button>

            {/* Article Content Layout */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-black text-[#2563EB] uppercase tracking-wider">
                  {selectedArticle.category}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                  <Calendar className="h-4 w-4" />
                  <span>{selectedArticle.publishDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                  <Clock className="h-4 w-4" />
                  <span>{selectedArticle.readTime}</span>
                </div>
              </div>

              <h1 className="text-3xl font-black text-[#0B1120] sm:text-4xl leading-snug">
                {selectedArticle.title}
              </h1>

              <div className="h-px bg-slate-100" />

              {/* Cover Image */}
              <div className="h-80 w-full rounded-2xl overflow-hidden bg-slate-100">
                <img 
                   src={selectedArticle.coverImageUrl || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60'} 
                   alt={selectedArticle.title} 
                   className="h-full w-full object-cover"
                />
              </div>

              {/* Author Row */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 text-white font-black flex items-center justify-center">
                  {selectedArticle.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[#0B1120]">{selectedArticle.author}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Platform Creator | Expert Author</p>
                </div>
              </div>

              {/* Actual Content Body */}
              <article className="prose prose-slate max-w-none text-slate-600 font-semibold text-sm leading-relaxed whitespace-pre-wrap pt-4">
                {selectedArticle.content}
              </article>

              {/* Social sharing buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-y border-slate-100 py-6 mt-8">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Share This Digital Tutorial:</span>
                <div className="flex gap-2.5">
                  <button 
                     onClick={() => triggerSocialShare('fb', selectedArticle.title)}
                     className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 bg-white hover:bg-blue-50 hover:text-blue-600 font-bold text-xs transition active:scale-95 shadow-sm cursor-pointer"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </button>
                  <button 
                     onClick={() => triggerSocialShare('wa', selectedArticle.title)}
                     className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 bg-white hover:bg-emerald-50 hover:text-emerald-600 font-bold text-xs transition active:scale-95 shadow-sm cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp
                  </button>
                </div>
              </div>

              {/* REVIEWS & USER COMMENTS SECTION (DEEP INTEGRATION) */}
              <div className="pt-8">
                <h3 className="text-lg font-black text-[#0B1120] mb-6">User Reviews & Questions ({reviews.length})</h3>
                 
                {/* Submit review */}
                <form onSubmit={handleReviewSubmit} className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl mb-8 flex flex-col gap-4 text-left">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-[#2563EB]" />
                    Review this Guide
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">Your Name</label>
                      <input
                        type="text"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="E.g., Anil Kakoti"
                        className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 transition"
                        required
                        disabled={submittingReview}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">Rating (Stars)</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 transition"
                        disabled={submittingReview}
                      >
                        <option value={5}>5 Stars ★★★★★</option>
                        <option value={4}>4 Stars ★★★★☆</option>
                        <option value={3}>3 Stars ★★★☆☆</option>
                        <option value={2}>2 Stars ★★☆☆☆</option>
                        <option value={1}>1 Star ★☆☆☆☆</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">Your Feedback or Question</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write your constructive thoughts or support question..."
                      className="w-full rounded-xl bg-white border border-slate-200 p-3.5 text-xs font-semibold focus:outline-none focus:border-blue-500 transition"
                      rows={3}
                      required
                      disabled={submittingReview}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="self-start flex items-center gap-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-black px-5 py-3 text-xs uppercase tracking-widest transition active:scale-95 disabled:opacity-50 shadow-md shadow-blue-200/40 cursor-pointer"
                  >
                    Submit Review
                  </button>
                  {reviewError && <p className="text-xs text-red-500 font-bold mt-1">{reviewError}</p>}
                </form>

                {/* Reviews List */}
                <div className="flex flex-col gap-4">
                  {reviews.length === 0 ? (
                    <p className="text-xs font-semibold text-slate-400 italic">No reviews for this article yet. Be the first to add yours!</p>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="border border-slate-200 rounded-2xl p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-xs font-extrabold text-[#0B1120]">{rev.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{rev.date}</span>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                 key={i} 
                                 className={`h-3.5 w-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                               />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic text-left">"{rev.comment}"</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Normal Blog catalog listing */
          <div className="flex flex-col gap-12 text-left">
            <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
              <span className="text-xs font-black tracking-widest text-[#2563EB] uppercase">TUTORIALS & STRATEGY</span>
              <h2 className="text-3xl font-black text-[#0B1120] sm:text-4xl leading-tight">
                Creator Articles & Case Studies
              </h2>
              <p className="text-slate-600 font-medium">
                Keep up to date with Facebook algorithm changes, verified page recuperations, monetization policy audits, and visual curation logs.
              </p>
            </div>

            {articles.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400 font-bold max-w-md mx-auto">
                No guides or case studies published yet. Montu Baruah is writing helpful tutorials. Stay tuned!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                {articles.map((art) => (
                  <div 
                     key={art.id} 
                     className="flex flex-col h-full rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden group"
                  >
                    {/* Cover block */}
                    <div className="relative h-44 w-full rounded-xl overflow-hidden mb-5 bg-slate-100">
                      <img 
                         src={art.coverImageUrl || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60'} 
                         alt={art.title} 
                         className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center rounded-lg bg-white/90 backdrop-blur-sm border border-slate-200/50 px-2.5 py-1 text-[10px] font-black text-slate-700 uppercase tracking-wider">
                          {art.category}
                        </span>
                      </div>
                    </div>

                    {/* Metadata block */}
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2.5">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{art.publishDate}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{art.readTime}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-[#0B1120] mb-2 group-hover:text-[#2563EB] transition-colors leading-snug line-clamp-2 text-left">
                      {art.title}
                    </h3>
                     
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 flex-grow line-clamp-3 text-left">
                      {art.excerpt}
                    </p>

                    <button
                      onClick={() => setSelectedArticle(art)}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 border border-slate-200/60 hover:bg-slate-200 hover:text-slate-900 text-slate-700 font-black py-3 text-xs uppercase tracking-wider transition active:scale-95 mt-auto cursor-pointer"
                    >
                      READ GUIDE
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
