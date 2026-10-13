import { useState } from 'react';
import { Star, MessageSquare, Send, TrendingUp, ThumbsUp } from 'lucide-react';
import { MOCK_FEEDBACK } from '@/constants/mockData';
import type { Feedback } from '@/types';
import { generateId, timeAgo } from '@/lib/utils';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

function StarRating({ value, onChange, size = 20 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type={onChange ? 'button' : undefined}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => onChange && setHover(i)}
          onMouseLeave={() => onChange && setHover(0)}
          className={cn('transition-transform', onChange ? 'hover:scale-110 cursor-pointer' : 'cursor-default')}
        >
          <Star
            size={size}
            className={cn(
              'transition-colors',
              (hover || value) >= i ? 'text-brand-400 fill-brand-400' : 'text-surface-500'
            )}
          />
        </button>
      ))}
    </div>
  );
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(MOCK_FEEDBACK);
  const [form, setForm] = useState({ customerName: '', tableNumber: '', comment: '', rating: 0, foodRating: 0, serviceRating: 0, ambianceRating: 0 });
  const [submitted, setSubmitted] = useState(false);

  const avgRating = feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length;
  const distribution = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: feedbacks.filter(f => f.rating === r).length,
    pct: Math.round((feedbacks.filter(f => f.rating === r).length / feedbacks.length) * 100),
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.rating || !form.foodRating || !form.serviceRating || !form.ambianceRating) {
      toast.error('Please rate all categories');
      return;
    }
    const newFeedback: Feedback = {
      id: generateId(),
      customerName: form.customerName || 'Anonymous Guest',
      tableNumber: form.tableNumber ? parseInt(form.tableNumber) : undefined,
      rating: form.rating,
      foodRating: form.foodRating,
      serviceRating: form.serviceRating,
      ambianceRating: form.ambianceRating,
      comment: form.comment,
      createdAt: new Date().toISOString(),
    };
    setFeedbacks(prev => [newFeedback, ...prev]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ customerName: '', tableNumber: '', comment: '', rating: 0, foodRating: 0, serviceRating: 0, ambianceRating: 0 });
    }, 2500);
    toast.success('Thank you for your feedback!');
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Summary */}
        <div className="space-y-4">
          <div className="glass-card-glow p-6 text-center">
            <div className="text-6xl font-bold font-heading gradient-text mb-1">{avgRating.toFixed(1)}</div>
            <StarRating value={Math.round(avgRating)} size={22} />
            <p className="text-sm text-muted-foreground mt-2">{feedbacks.length} reviews</p>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-400" /> Rating Breakdown
            </h3>
            <div className="space-y-2">
              {distribution.map(({ rating, count, pct }) => (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground w-4 text-right">{rating}</span>
                  <Star size={11} className="text-brand-400 fill-brand-400 flex-shrink-0" />
                  <div className="flex-1 bg-surface-700 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-muted-foreground w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5 grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Food', value: (feedbacks.reduce((s, f) => s + f.foodRating, 0) / feedbacks.length).toFixed(1) },
              { label: 'Service', value: (feedbacks.reduce((s, f) => s + f.serviceRating, 0) / feedbacks.length).toFixed(1) },
              { label: 'Ambiance', value: (feedbacks.reduce((s, f) => s + f.ambianceRating, 0) / feedbacks.length).toFixed(1) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xl font-bold font-heading gradient-text">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form + List */}
        <div className="lg:col-span-2 space-y-5">
          {/* Form */}
          <div className="glass-card p-6">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-brand-400" />
              Leave Your Feedback
            </h3>
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                  <ThumbsUp size={28} className="text-emerald-400" />
                </div>
                <h4 className="font-heading text-lg font-semibold text-foreground mb-1">Thank You!</h4>
                <p className="text-sm text-muted-foreground">Your feedback helps us improve your experience.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Your Name (optional)</label>
                    <input
                      value={form.customerName}
                      onChange={e => setForm(p => ({ ...p, customerName: e.target.value }))}
                      placeholder="Guest"
                      className="w-full px-3 py-2 bg-surface-700 border border-surface-500 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Table Number (optional)</label>
                    <input
                      value={form.tableNumber}
                      onChange={e => setForm(p => ({ ...p, tableNumber: e.target.value }))}
                      type="number" placeholder="e.g. 5"
                      className="w-full px-3 py-2 bg-surface-700 border border-surface-500 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { key: 'rating', label: 'Overall Experience' },
                    { key: 'foodRating', label: 'Food Quality' },
                    { key: 'serviceRating', label: 'Service' },
                    { key: 'ambianceRating', label: 'Ambiance' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">{label}</label>
                      <StarRating
                        value={(form as Record<string, number>)[key]}
                        onChange={v => setForm(p => ({ ...p, [key]: v }))}
                        size={22}
                      />
                      {(form as Record<string, number>)[key] > 0 && (
                        <p className="text-xs text-brand-400 mt-1">{RATING_LABELS[(form as Record<string, number>)[key]]}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Your Comment</label>
                  <textarea
                    value={form.comment}
                    onChange={e => setForm(p => ({ ...p, comment: e.target.value }))}
                    placeholder="Tell us about your experience..."
                    rows={3}
                    className="w-full px-3 py-2 bg-surface-700 border border-surface-500 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-500 transition-colors resize-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                  <Send size={15} /> Submit Feedback
                </button>
              </form>
            )}
          </div>

          {/* Reviews List */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-3">Recent Reviews</h3>
            <div className="space-y-3">
              {feedbacks.map(fb => (
                <div key={fb.id} className="glass-card p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                        {fb.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{fb.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {fb.tableNumber ? `Table ${fb.tableNumber} · ` : ''}{timeAgo(fb.createdAt)}
                        </p>
                      </div>
                    </div>
                    <StarRating value={fb.rating} size={13} />
                  </div>
                  {fb.comment && <p className="text-sm text-muted-foreground leading-relaxed">{fb.comment}</p>}
                  <div className="flex gap-3 mt-2">
                    {[
                      { l: 'Food', v: fb.foodRating },
                      { l: 'Service', v: fb.serviceRating },
                      { l: 'Ambiance', v: fb.ambianceRating },
                    ].map(({ l, v }) => (
                      <span key={l} className="text-xs text-muted-foreground">
                        {l}: <span className="text-brand-400 font-medium">{v}/5</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
