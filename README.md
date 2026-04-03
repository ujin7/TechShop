# TechShop

> 2026 프리미엄 IT 디바이스 전문 쇼핑몰 — Next.js 14 App Router 기반 풀스택 E-Commerce

다크모드 글래스모피즘 디자인과 몰입형 UX를 갖춘 IT 기기 쇼핑몰입니다.  
스마트폰·노트북·태블릿·모니터·오디오·액세서리 6개 카테고리, 40개 상품을 다룹니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 상품 목록 / 필터 | URL 쿼리 기반 필터(브랜드·가격·평점·재고), 정렬, 페이지네이션 |
| 실시간 검색 | 300ms 디바운스 자동완성 오버레이, 띄어쓰기 무시 토큰 AND 검색 |
| 상품 비교 | 최대 3개 나란히 비교, 최저가·최고 평점 자동 하이라이트 |
| 장바구니 | localStorage 영속화, 수량 조절, 배송비 자동 계산 |
| 결제 플로우 | 배송지 → 결제 수단 → 주문 확인 3단계 |
| 리뷰 시스템 | 별점 + 제목 + 내용 작성, 낙관적 UI 업데이트, 평점 분포 히스토그램 |
| 로그인 / 회원가입 | 이메일·비밀번호 인증, localStorage 세션 유지 |
| 마이페이지 | 주문 내역, 리뷰 내역, 프로필 편집 |
| 최근 본 상품 | localStorage 기반 자동 기록 |
| 반응형 | 모바일·태블릿·데스크탑 전 해상도 대응 |

---

## 기술 스택

- **Framework** — Next.js 14 (App Router, React 18)
- **언어** — JavaScript (JSX)
- **스타일** — CSS Modules + CSS Variables (60+ 디자인 토큰, Tailwind 미사용)
- **상태 관리** — Context API + Custom Hooks (로직 분리 설계)
- **데이터 영속화** — Prisma + SQLite (`products`, `users`, `reviews`, `orders`)
- **아이콘** — lucide-react
- **API** — Next.js Route Handlers (7개 엔드포인트)

---

## 폴더 구조

```
src/
├── app/                        # Next.js App Router 페이지
│   ├── api/                    # Route Handlers
│   │   ├── auth/login·signup   # 인증 API
│   │   ├── products/           # 상품 목록 / 단건 조회
│   │   ├── reviews/            # 리뷰 조회 / 작성
│   │   └── orders/             # 주문 생성
│   ├── categories/             # 카테고리 · 서브카테고리 페이지
│   ├── products/[id]/          # 상품 상세
│   ├── compare/                # 상품 비교
│   ├── checkout/               # 결제
│   ├── mypage/                 # 마이페이지
│   └── search/                 # 검색 결과
│
├── components/
│   ├── layout/     # Navbar, Footer, ClientLayout, SearchOverlay
│   ├── home/       # Hero, FeaturedBanner, CategoryShowcase, TrendingProducts, RecentlyViewed
│   ├── product/    # ProductCard, ProductGrid, ProductFilter, ProductSort, StarRating 등
│   ├── cart/       # CartDrawer
│   ├── compare/    # CompareBar, CompareTable
│   ├── checkout/   # ShippingForm, PaymentMethod, OrderSummary
│   ├── auth/       # AuthModal
│   └── ui/         # Button, Badge, Modal, Toast, Pagination, Breadcrumb, Skeleton, GlowCard
│
├── context/                    # 전역 상태 (state + dispatch 만 보관)
│   ├── CartContext.jsx
│   ├── AuthContext.jsx
│   ├── CompareContext.jsx
│   └── ToastContext.jsx
│
├── hooks/                      # 비즈니스 로직 (파생값 + 액션)
│   ├── useCart.js
│   ├── useAuth.js
│   ├── useCompare.js
│   ├── useToast.js
│   ├── useProducts.js          # AbortController 기반 fetch
│   └── useUrlFilter.js         # URL 쿼리 ↔ 필터 객체 동기화
│
├── data/           # 목 데이터 (products 40개, reviews, users, categories, orders)
├── lib/            # Prisma client, DB 직렬화 유틸
├── data/           # 시드 원본 목 데이터
├── utils/          # 순수 함수 (formatPrice, filterProducts, localStorage)
└── ../prisma/      # schema.prisma, seed.js
```

---

## 실행 방법

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
# → http://localhost:3000
```

**데모 계정**
- 이메일: `demo@techshop.kr`
- 비밀번호: `demo1234`

---

## 설계 특징

### Context + Hooks 분리

Context는 원시 상태(state)와 dispatch만 보유하고, 파생값 계산과 액션 로직은 전부 custom hook에서 처리합니다.

```js
// CartContext — 상태만
{ items, dispatch, isDrawerOpen, setIsDrawerOpen }

// useCart hook — 파생값 + 액션
{ totalItems, subtotal, shippingFee, total, addToCart, removeFromCart, ... }
```

컴포넌트는 Context를 직접 참조하지 않고 hook만 바라보므로, 내부 구현이 바뀌어도 인터페이스가 유지됩니다.

### URL 기반 필터 상태

`useUrlFilter` hook이 URL searchParams와 필터 객체를 양방향으로 동기화합니다.  
필터가 URL에 저장되므로 새로고침해도 유지되고, 뒤로가기도 자연스럽게 동작합니다.

### 경쟁 조건 방지

`useProducts`는 이전 요청이 아직 처리 중일 때 새 요청이 오면 `AbortController`로 이전 요청을 자동 취소합니다.

### 낙관적 UI 업데이트

리뷰 작성 시 서버 응답을 기다리지 않고 임시 항목을 즉시 렌더링합니다. 저장 성공 시 서버 데이터로 교체, 실패 시 롤백합니다.

---

## 개선 예정

- [ ] 비밀번호 해시 저장 (bcrypt)
- [ ] Prisma Migrate 기반 버전 관리 도입
- [ ] 찜하기 기능
- [ ] 모바일 햄버거 메뉴
- [ ] `next/image` 전환 (이미지 최적화)
- [ ] 결제 API 연동 (토스페이먼츠)
- [ ] 관리자 대시보드
