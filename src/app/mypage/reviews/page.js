'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Pencil, Trash2, Check, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import StarRating from '@/components/product/StarRating';
import styles from './page.module.css';

function ReviewCard({ review, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ rating: review.rating, title: review.title, content: review.content });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetchWithAuth('/api/reviews', {
      method: 'PATCH',
      body: JSON.stringify({ reviewId: review.id, ...form }),
    });
    setSaving(false);
    if (res.ok) {
      const { data } = await res.json();
      onUpdated(data);
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('리뷰를 삭제하시겠습니까?')) return;
    const res = await fetchWithAuth(`/api/reviews?reviewId=${review.id}`, { method: 'DELETE' });
    if (res.ok) onDeleted(review.id);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        {editing ? (
          <div className={styles.starEdit}>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                className={`${styles.starBtn} ${form.rating >= s ? styles.starActive : ''}`}
                onClick={() => setForm((f) => ({ ...f, rating: s }))}
                type="button"
              >★</button>
            ))}
          </div>
        ) : (
          <StarRating value={review.rating} size="sm" />
        )}
        <span className={styles.date}>{new Date(review.createdAt).toLocaleDateString('ko-KR')}</span>
        <div className={styles.actions}>
          {editing ? (
            <>
              <button className={styles.actionBtn} onClick={handleSave} disabled={saving} title="저장">
                <Check size={15} />
              </button>
              <button className={styles.actionBtn} onClick={() => setEditing(false)} title="취소">
                <X size={15} />
              </button>
            </>
          ) : (
            <>
              <button className={styles.actionBtn} onClick={() => setEditing(true)} title="수정">
                <Pencil size={15} />
              </button>
              <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={handleDelete} title="삭제">
                <Trash2 size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <>
          <input
            className={styles.editInput}
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="제목 (선택)"
          />
          <textarea
            className={styles.editTextarea}
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            rows={4}
          />
        </>
      ) : (
        <>
          {review.title && <p className={styles.reviewTitle}>{review.title}</p>}
          <p className={styles.content}>{review.content}</p>
          <p className={styles.helpful}>👍 도움됐어요 {review.helpful}</p>
        </>
      )}
    </div>
  );
}

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/reviews?userId=${user.id}&limit=50`)
      .then((r) => r.ok ? r.json() : { data: [] })
      .then(({ data }) => setReviews(data || []))
      .finally(() => setIsLoading(false));
  }, [user]);

  const handleUpdated = (updated) => setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  const handleDeleted = (id) => setReviews((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>내 리뷰</h2>

      {isLoading ? (
        <div style={{ color: 'var(--text-secondary)' }}>불러오는 중...</div>
      ) : reviews.length === 0 ? (
        <div className={styles.empty}>
          <MessageSquare size={48} style={{ opacity: 0.2 }} />
          <p>작성한 리뷰가 없습니다.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
