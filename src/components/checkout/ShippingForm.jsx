'use client';

import { useState } from 'react';
import { MapPin, User, Phone, MessageSquare } from 'lucide-react';
import Button from '@/components/ui/Button';
import styles from './ShippingForm.module.css';

export default function ShippingForm({ onSubmit = () => {}, defaultValues = null }) {
  const [form, setForm] = useState({
    recipient: defaultValues?.recipient || '',
    phone:     defaultValues?.phone     || '',
    zipcode:   defaultValues?.zipcode   || '',
    address1:  defaultValues?.address1  || '',
    address2:  defaultValues?.address2  || '',
    message:   '',
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>배송 정보</h2>

      <div className={styles.field}>
        <label className={styles.label}>
          <User size={15} /> 수령인
        </label>
        <input
          className={styles.input}
          type="text"
          value={form.recipient}
          onChange={set('recipient')}
          placeholder="홍길동"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          <Phone size={15} /> 전화번호
        </label>
        <input
          className={styles.input}
          type="tel"
          value={form.phone}
          onChange={set('phone')}
          placeholder="010-0000-0000"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          <MapPin size={15} /> 우편번호
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className={styles.input}
            type="text"
            value={form.zipcode}
            onChange={set('zipcode')}
            placeholder="12345"
            style={{ flex: 1 }}
          />
          <button type="button" className={styles.searchBtn}>주소 찾기</button>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>기본 주소</label>
        <input
          className={styles.input}
          type="text"
          value={form.address1}
          onChange={set('address1')}
          placeholder="서울특별시 강남구 테헤란로 123"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>상세 주소</label>
        <input
          className={styles.input}
          type="text"
          value={form.address2}
          onChange={set('address2')}
          placeholder="101호"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          <MessageSquare size={15} /> 배송 메모
        </label>
        <select className={styles.input} value={form.message} onChange={set('message')}>
          <option value="">선택해주세요</option>
          <option value="문 앞에 놔주세요">문 앞에 놔주세요</option>
          <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
          <option value="직접 받겠습니다">직접 받겠습니다</option>
          <option value="택배함에 넣어주세요">택배함에 넣어주세요</option>
        </select>
      </div>

      <Button type="submit" variant="primary" size="lg" style={{ width: '100%', marginTop: 8 }}>
        다음 단계 →
      </Button>
    </form>
  );
}
