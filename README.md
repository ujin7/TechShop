# TechShop

Next.js 14 App Router 기반의 프리미엄 IT 디바이스 쇼핑몰 프로젝트입니다.  
스마트폰, 노트북, 태블릿, 모니터, 오디오, 액세서리를 탐색하고 비교하고 장바구니에 담을 수 있도록 구성되어 있습니다.

## Stack

- Next.js 14
- React 18
- Prisma ORM
- PostgreSQL / Supabase
- Supabase Auth
- CSS Modules
- Lucide React

## Features

- 홈 화면 큐레이션 섹션과 마이크로 인터랙션
- 카테고리 / 서브카테고리 탐색
- 상품 카드, 상품 상세, 비교 기능
- 장바구니 / 체크아웃 흐름
- 리뷰 섹션 및 마이페이지 구조
- 이메일 로그인 / 회원가입
- Google OAuth 로그인
- `/cart`, `/orders` 보호 라우트

## Project Structure

```text
src/
  app/
    api/
    auth/
    categories/
    compare/
    products/
    checkout/
    mypage/
  components/
    auth/
    cart/
    checkout/
    compare/
    home/
    layout/
    product/
    ui/
  context/
  hooks/
  lib/
    supabase/
  utils/
prisma/
public/
```

## Local Development

### 1. Install

```bash
npm install
```

### 2. Environment Variables

`.env` 또는 `.env.local`에 아래 값을 설정합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
JWT_SECRET=your-random-secret
```

### 3. Prisma

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. Run

```bash
npm run dev
```

## Scripts

- `npm run dev` : 개발 서버 실행
- `npm run build` : `prisma generate` 후 프로덕션 빌드
- `npm run start` : 프로덕션 서버 실행
- `npm run lint` : ESLint 실행
- `npm run db:generate` : Prisma Client 생성
- `npm run db:push` : 스키마를 데이터베이스에 반영
- `npm run db:seed` : 샘플 데이터 입력
- `npm run db:studio` : Prisma Studio 실행

## Deployment

Vercel 배포 시 아래 환경변수가 필요합니다.

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
DATABASE_URL
DIRECT_URL
JWT_SECRET
```

프로젝트의 `build` 스크립트에는 이미 `prisma generate && next build`가 포함되어 있습니다.

## Notes

- 현재 UI는 CSS Modules 기반으로 구성되어 있습니다.
- 일부 상품 메타데이터는 시드 데이터 기반이므로, 운영 환경에서는 실제 DB 데이터 기준으로 연결하는 것이 좋습니다.
- Supabase Auth를 사용하며, 브라우저와 서버 양쪽에서 세션을 처리하도록 구성되어 있습니다.
