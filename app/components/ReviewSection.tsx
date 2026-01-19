import {useState} from 'react';
import {Button} from '~/components/ui/button';
import {Textarea} from '~/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {Badge} from '~/components/ui/badge';
import {Star, ThumbsUp, User} from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
}

// Mock reviews - in production, these would come from a reviews API (Judge.me, Yotpo, etc.)
const mockReviews: Review[] = [
  {
    id: '1',
    author: 'Alex M.',
    rating: 5,
    title: 'Incredible quality',
    content: 'The heavyweight cotton is exactly as described. This isn\'t your average fast fashion tee - it\'s built to last. Love the limited run concept too.',
    date: '2026-01-15',
    verified: true,
    helpful: 12,
  },
  {
    id: '2',
    author: 'Jordan K.',
    rating: 5,
    title: 'Worth the wait',
    content: 'Finally got my hands on a piece from the drop. The attention to detail is unmatched. Already planning to collect more.',
    date: '2026-01-10',
    verified: true,
    helpful: 8,
  },
  {
    id: '3',
    author: 'Sam R.',
    rating: 4,
    title: 'Great piece, runs slightly large',
    content: 'Love the design and quality. Only note - it runs a bit oversized. Size down if you want a more fitted look.',
    date: '2026-01-05',
    verified: true,
    helpful: 15,
  },
];

interface ReviewSectionProps {
  productId: string;
  productTitle: string;
}

export function ReviewSection({productId, productTitle}: ReviewSectionProps) {
  const [showWriteReview, setShowWriteReview] = useState(false);
  const reviews = mockReviews; // In production, fetch based on productId

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100,
  }));

  return (
    <section className="py-16 bg-[#F2EFE9]">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-px bg-[#B55A3C]" />
          <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase">
            Collector Reports
          </span>
          <div className="w-12 h-px bg-[#B55A3C]" />
        </div>

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-baseline justify-center md:justify-start gap-2 mb-2">
              <span className="font-heading text-5xl text-[#1a472a]">
                {averageRating.toFixed(1)}
              </span>
              <span className="font-mono text-xs text-[#8A8A84] uppercase">/ 5</span>
            </div>
            <div className="flex justify-center md:justify-start gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(averageRating)
                      ? 'fill-[#B55A3C] text-[#B55A3C]'
                      : 'text-[#8A8A84]/30'
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-xs text-[#8A8A84]">
              Based on {reviews.length} report{reviews.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {ratingCounts.map(({rating, count, percentage}) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="font-mono text-xs text-[#8A8A84] w-4">{rating}</span>
                <Star className="w-3 h-3 fill-[#B55A3C] text-[#B55A3C]" />
                <div className="flex-1 h-2 bg-[#1a472a]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#B55A3C] rounded-full transition-all"
                    style={{width: `${percentage}%`}}
                  />
                </div>
                <span className="font-mono text-xs text-[#8A8A84] w-6">{count}</span>
              </div>
            ))}
          </div>

          {/* Write Review CTA */}
          <div className="text-center md:text-right">
            <Button
              onClick={() => setShowWriteReview(!showWriteReview)}
              className="bg-[#B55A3C] hover:bg-[#9A4A30] text-[#F2EFE9] font-mono text-xs uppercase tracking-wider"
            >
              Write a Report
            </Button>
            <p className="font-mono text-[10px] text-[#8A8A84] mt-2">
              Share your experience with this piece
            </p>
          </div>
        </div>

        {/* Write Review Form */}
        {showWriteReview && (
          <Card className="mb-8 bg-white/50 border-[#1a472a]/10">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-[#1a472a] uppercase tracking-wide">
                Submit Your Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WriteReviewForm
                productTitle={productTitle}
                onSubmit={() => setShowWriteReview(false)}
              />
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Load More */}
        {reviews.length >= 3 && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              className="border-[#1a472a]/20 text-[#1a472a] hover:border-[#B55A3C] hover:text-[#B55A3C] font-mono text-xs uppercase tracking-wider"
            >
              Load More Reports
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewCard({review}: {review: Review}) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpful((prev) => prev + 1);
      setHasVoted(true);
    }
  };

  return (
    <Card className="bg-white/50 border-[#1a472a]/10">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-[#1a472a]/10 flex items-center justify-center">
                <User className="w-4 h-4 text-[#1a472a]" />
              </div>
              <div>
                <span className="font-mono text-sm text-[#1a472a]">{review.author}</span>
                {review.verified && (
                  <Badge className="ml-2 bg-[#1a472a]/10 text-[#1a472a] font-mono text-[9px] uppercase">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= review.rating
                        ? 'fill-[#B55A3C] text-[#B55A3C]'
                        : 'text-[#8A8A84]/30'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-[10px] text-[#8A8A84]">
                {new Date(review.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        <h4 className="font-heading text-sm text-[#1a472a] uppercase mb-2">{review.title}</h4>
        <p className="font-mono text-xs text-[#8A8A84] leading-relaxed mb-4">
          {review.content}
        </p>

        <button
          onClick={handleHelpful}
          disabled={hasVoted}
          className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
            hasVoted
              ? 'text-[#B55A3C]'
              : 'text-[#8A8A84] hover:text-[#B55A3C]'
          }`}
        >
          <ThumbsUp className="w-3 h-3" />
          Helpful ({helpful})
        </button>
      </CardContent>
    </Card>
  );
}

function WriteReviewForm({
  productTitle,
  onSubmit,
}: {
  productTitle: string;
  onSubmit: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, submit to reviews API
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Rating */}
      <div>
        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A84] block mb-2">
          Your Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'fill-[#B55A3C] text-[#B55A3C]'
                    : 'text-[#8A8A84]/30'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A84] block mb-2">
          Review Title
        </label>
        <input
          type="text"
          placeholder="Summarize your experience"
          className="w-full px-4 py-2 border border-[#1a472a]/20 bg-transparent font-mono text-sm text-[#1a472a] placeholder:text-[#8A8A84] focus:outline-none focus:border-[#B55A3C]"
        />
      </div>

      {/* Content */}
      <div>
        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A84] block mb-2">
          Your Report
        </label>
        <Textarea
          placeholder="Share the details of your experience..."
          className="min-h-[120px] border-[#1a472a]/20 bg-transparent font-mono text-sm text-[#1a472a] placeholder:text-[#8A8A84] focus:border-[#B55A3C]"
        />
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={rating === 0}
          className="bg-[#B55A3C] hover:bg-[#9A4A30] text-[#F2EFE9] font-mono text-xs uppercase tracking-wider"
        >
          Submit Report
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onSubmit}
          className="border-[#1a472a]/20 text-[#1a472a] font-mono text-xs uppercase tracking-wider"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
