'use client';

import React, { useState } from 'react';
import { Product, Review } from '@/types/marketplace';
import { StarRating } from '@/components/common/StarRating';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { Star, MessageSquare, ThumbsUp, ShieldCheck } from 'lucide-react';
import { formatDate } from '@/lib/formatters';

interface ProductReviewsSectionProps {
  product: Product;
}

export function ProductReviewsSection({ product }: ProductReviewsSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useMarketplace();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial mock / demo reviews for this product
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      productId: product.id,
      userId: 'user-demo-1',
      author: 'Tanvir Ahmed',
      title: 'Authentic product',
      rating: 5,
      comment: 'Authentic product and prompt courier delivery in Dhaka within 48 hours. Packaging was secure.',
      date: '2025-02-10T10:30:00Z',
      verifiedPurchase: true,
      helpfulCount: 8,
    },
    {
      id: 'rev-2',
      productId: product.id,
      userId: 'user-demo-2',
      author: 'Nusrat Jahan',
      title: 'Great quality',
      rating: 4,
      comment: 'Great quality, matches the catalog photos. Value for money in BDT.',
      date: '2025-02-14T14:15:00Z',
      verifiedPurchase: true,
      helpfulCount: 4,
    }
  ]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Authentication Required', 'Please log in to submit a verified product review.', 'info');
      return;
    }
    if (!comment.trim()) {
      showToast('Review Required', 'Please enter your review comments.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newReview: Review = {
        id: `rev-${Date.now()}`,
        productId: product.id,
        userId: user?.uid || 'user-current',
        author: user?.displayName || 'Customer',
        title: 'Verified Customer Review',
        rating,
        comment: comment.trim(),
        date: new Date().toISOString(),
        verifiedPurchase: true,
        helpfulCount: 0,
      };

      setReviews([newReview, ...reviews]);
      setComment('');
      setIsSubmitting(false);
      showToast('Review Submitted', 'Thank you for your feedback! Your review is now live.', 'success');
    }, 400);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-neutral-800" />
            Customer Ratings &amp; Reviews
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real feedback from verified buyers across Bangladesh
          </p>
        </div>

        <div className="flex items-center gap-3 bg-neutral-50 px-4 py-2.5 rounded-2xl border border-neutral-200/80">
          <div className="text-2xl font-black text-neutral-900">
            {product.rating.toFixed(1)}
          </div>
          <div>
            <StarRating value={product.rating} max={5} size="sm" readOnly />
            <div className="text-[11px] text-neutral-500 font-medium mt-0.5">
              Based on {reviews.length} verified reviews
            </div>
          </div>
        </div>
      </div>

      {/* Review Submission Box */}
      <div className="bg-neutral-50/70 border border-neutral-200/80 rounded-2xl p-4 sm:p-5">
        <h4 className="text-sm font-bold text-neutral-900 mb-2">Write a Review</h4>
        <form onSubmit={handleSubmitReview} className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-600 font-medium">Your Rating:</span>
            <StarRating value={rating} onChange={(r) => setRating(r)} max={5} size="sm" />
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Share your experience regarding the quality, packaging, and delivery..."
            className="w-full text-xs p-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900 transition-colors"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isSubmitting ? 'Posting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-4 rounded-2xl border border-neutral-100 bg-white shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900">{rev.author}</span>
                {rev.verifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified Buyer
                  </span>
                )}
              </div>
              <span className="text-[11px] text-neutral-400">{formatDate(rev.date)}</span>
            </div>

            <StarRating value={rev.rating} max={5} size="xs" readOnly />
            <p className="text-xs text-neutral-700 leading-relaxed">{rev.comment}</p>

            <div className="pt-1 flex items-center gap-1 text-[11px] text-neutral-400">
              <ThumbsUp className="w-3 h-3" />
              <span>{rev.helpfulCount || 0} people found this helpful</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
