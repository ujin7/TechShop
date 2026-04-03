'use client';

import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import StarRating from './StarRating';
import Button from '@/components/ui/Button';
import styles from './ProductReviewSection.module.css';

export default function ProductReviewSection({
  productId, reviews = [],
  reviewMeta = { avgRating: 0, ratingDist: [], total: 0 },
  onAddReview = async () => {},
}) {
  const { user } = useAuth();
  const [rating, setRating]   = useState(5);
  const [title, setTitle]     = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    await onAddReview({ productId, userId: user.id, userName: user.name, rating, title, content });
    setRating(5); setTitle(''); setContent('');
    setSubmitting(false);
  };

  const totalDist = reviewMeta.ratingDist.reduce((s, r) => s + r.count, 0) || 1;

  return (
    <div className={styles.section}>
      {/* 요약 */}
      <div className={styles.summary}>
        <div className={styles.avgBlock}>
          <span className={styles.avgNum}>{reviewMeta.avgRating.toFixed(1)}</span>
          <StarRating value={reviewMeta.avgRating} size="lg" />
          <span className={styles.totalCount}>{reviewMeta.total}개 리뷰</span>
        </div>
        <div className={styles.distBlock}>
          {[5, 4, 3, 2, 1].map((n) => {
            const found = reviewMeta.ratingDist.find((r) => r.rating === n);
            const pct = found ? (found.count / totalDist) * 100 : 0;
            return (
              <div key={n} className={styles.distRow}>
                <span className={styles.distLabel}>{n}★</span>
                <div className={styles.distBar}>
                  <div className={styles.distFill} style={{ width: `${pct}%` }} />
                </div>
                <span className={styles.distCount}>{found?.count || 0}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 리뷰 작성 폼 */}
      {user ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3 className={styles.formTitle}>리뷰 작성</h3>
          <div className={styles.formRating}>
            <span className={styles.formLabel}>별점</span>
            <StarRating value={rating} interactive onChange={setRating} size="lg" />
          </div>
          <input
            className={styles.input}
            type="text"
            placeholder="리뷰 제목 (선택)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className={styles.textarea}
            placeholder="솔직한 사용 후기를 남겨주세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
          />
          <Button type="submit" variant="primary" disabled={submitting || !content.trim()}>
            {submitting ? '등록 중...' : '리뷰 등록'}
          </Button>
        </form>
      ) : (
        <div className={styles.loginPrompt}>
          로그인 후 리뷰를 작성할 수 있습니다.
        </div>
      )}

      {/* 리뷰 목록 */}
      <div className={styles.list}>
        {reviews.length === 0 ? (
          <p className={styles.noReviews}>아직 리뷰가 없습니다. 첫 번째 리뷰를 남겨보세요!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <StarRating value={review.rating} size="sm" />
                  {review.title && <p className={styles.reviewTitle}>{review.title}</p>}
                </div>
                <div className={styles.cardMeta}>
                  <span className={styles.author}>{review.userName}</span>
                  <span className={styles.date}>
                    {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
              <p className={styles.content}>{review.content}</p>
              <button className={styles.helpfulBtn}>
                <ThumbsUp size={13} />
                <span>도움됐어요 {review.helpful || 0}</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
