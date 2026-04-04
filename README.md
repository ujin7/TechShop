# TechShop

TechShop은 Next.js 14 App Router 기반으로 만든 프리미엄 IT 기기 쇼핑 플랫폼입니다.  
스마트폰, 노트북, 태블릿, 모니터, 오디오, 액세서리 상품을 탐색하고 비교하며, 위시리스트, 장바구니, 체크아웃, 인증 기능까지 포함한 전자상거래 프로젝트입니다.

## 프로젝트 개요

- 프리미엄 IT 디바이스 중심의 쇼핑 UX 구현
- Prisma와 PostgreSQL / Supabase 기반 데이터 관리
- Supabase Auth 기반 이메일 회원가입 및 로그인
- 상품 이미지가 적용된 카드 및 상세 페이지 구성
- 홈 화면에서 실시간에 가까운 방문자 수 표시 기능 제공

## 기술 스택

- Next.js 14
- React 18
- Prisma ORM
- PostgreSQL / Supabase
- Supabase Auth
- CSS Modules
- Lucide React
- bcryptjs

## 주요 기능

- Hero, 카테고리 쇼케이스, 추천 섹션이 포함된 홈 화면
- 상품 목록 및 상품 상세 페이지
- 카테고리 / 서브카테고리 탐색
- 상품 비교 기능
- 위시리스트 및 장바구니 기능
- 체크아웃 흐름
- 이메일 기반 회원가입 / 로그인
- 홈 Hero 방문자 수 표시를 위한 presence tracking API

## 최근 반영 내용

- 전체 상품 이미지 40개 연결
- 상품 카드, 상세 페이지, 위시리스트에 실제 상품 이미지 표시
- `PresenceSession` 모델 및 `/api/presence` API 추가
- Google 로그인 제거 및 이메일 로그인 중심 인증 흐름 정리
- 홈 섹션 확장 및 카테고리 쇼케이스 UI 개선

## 프로젝트 구조

```text
src/
  app/
    api/
    auth/
    categories/
    checkout/
    compare/
    mypage/
    products/
  components/
    analytics/
    auth/
    cart/
    checkout/
    compare/
    home/
    layout/
    product/
    ui/
  context/
  data/
  hooks/
  lib/
    prisma/
    supabase/
  utils/
prisma/
public/
  images/
    products/
```

## 환경 변수

루트 경로에 `.env` 파일을 만들고 아래 값을 설정합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
JWT_SECRET=your-random-secret
```

## 로컬 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. Prisma Client 생성

```bash
npm run db:generate
```

### 3. 스키마 반영 및 시드 데이터 입력

```bash
npm run db:push
npm run db:seed
```

### 4. 개발 서버 실행

```bash
npm run dev
```

실행 후 `http://localhost:3000`에서 확인할 수 있습니다.

## 사용 가능한 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run dev:clean`: `.next` 삭제 후 개발 서버 실행
- `npm run reset:next`: `.next` 폴더 삭제
- `npm run build`: Prisma Client 생성 후 프로덕션 빌드
- `npm run start`: 프로덕션 서버 실행
- `npm run lint`: ESLint 실행
- `npm run db:generate`: Prisma Client 생성
- `npm run db:push`: Prisma 스키마를 데이터베이스에 반영
- `npm run db:seed`: 샘플 데이터 입력
- `npm run db:studio`: Prisma Studio 실행

## 인증 관련 메모

- 인증은 Supabase Auth를 사용합니다.
- 현재 UI는 이메일 회원가입 / 로그인 기준으로 구성되어 있습니다.
- 회원가입 직후 세션이 생성되지 않으면 Supabase의 이메일 인증 설정을 확인해야 합니다.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`에는 Supabase의 publishable key를 사용해야 합니다.

## 상품 이미지 경로

상품 이미지는 아래 경로에 저장되어 있습니다.

```text
public/images/products/
```

각 상품의 `thumbnail` 및 `images` 경로는 `src/data/products.js`에서 관리합니다.

## Presence Tracking

방문자 수 집계 기능은 아래 파일을 중심으로 구성되어 있습니다.

- `src/components/analytics/PresenceTracker.jsx`
- `src/app/api/presence/route.js`
- `prisma/schema.prisma`

브라우저가 일정 주기로 서버에 heartbeat를 보내고, 이를 기반으로 홈 Hero 영역에 현재 쇼핑 중인 사용자 수를 표시합니다.

## 배포

배포 시 아래 환경 변수가 필요합니다.

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
DATABASE_URL
DIRECT_URL
JWT_SECRET
```

현재 build 스크립트에는 Prisma Client 생성이 포함되어 있습니다.

```bash
prisma generate && next build
```

## 참고

- 스타일링은 CSS Modules 기반입니다.
- 상품 데이터는 로컬 데이터 파일을 기반으로 시드됩니다.
- 인증과 데이터베이스 인프라는 Supabase를 사용합니다.
