# TechShop

Next.js 14(App Router) + Prisma + PostgreSQL 기반 전자상거래 데모 프로젝트입니다.

## 주요 기능
- 상품 목록/상세 조회
- 카테고리/서브카테고리 탐색
- 검색, 정렬, 필터
- 장바구니, 주문 생성/조회/취소
- 리뷰 작성/수정/삭제
- 위시리스트
- 회원가입/로그인(JWT 쿠키 세션)
- 마이페이지(주문/리뷰/프로필)

## 기술 스택
- Next.js 14
- React 18
- Prisma ORM
- PostgreSQL
- lucide-react
- CSS Modules

## 프로젝트 구조
```text
src/
  app/                # App Router 페이지 + API Route Handlers
  components/         # UI/도메인 컴포넌트
  context/            # 전역 상태(Context)
  hooks/              # 커스텀 훅
  data/               # 시드용 데이터
  lib/                # prisma, auth, serializer
  utils/              # 유틸 함수
prisma/
  schema.prisma
  seed.js
```

## 환경 변수
`.env`에 아래 값을 설정하세요.

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="your-strong-random-secret"
```

- `DATABASE_URL`: PostgreSQL Pooler 연결 문자열(런타임용)
- `DIRECT_URL`: PostgreSQL Direct 연결 문자열(마이그레이션/관리용)
- `JWT_SECRET`: 세션 토큰 서명 키(충분히 길고 랜덤한 값 권장)

## 로컬 실행
```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

## 스크립트
- `npm run dev`: 개발 서버 실행
- `npm run build`: `prisma generate && next build`
- `npm run start`: 프로덕션 서버 실행
- `npm run lint`: ESLint 실행
- `npm run db:generate`: Prisma Client 생성
- `npm run db:push`: 스키마 반영
- `npm run db:seed`: 시드 데이터 입력
- `npm run db:studio`: Prisma Studio 실행

## 배포(Vercel)
Vercel 환경 변수에 아래 키를 등록하세요.
- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`

배포 시 `build` 스크립트에서 Prisma Client를 자동 생성합니다.

## 참고
- 주문/리뷰/위시리스트/회원가입 API는 DB 기본 `cuid()` ID를 사용해 동시 요청 시 ID 충돌을 피하도록 구성되어 있습니다.
- `/`와 `/api/products`는 DB 오류 시 로컬 데이터로 fallback 하도록 처리되어, 일시적인 DB 장애에서 전체 화면이 바로 죽지 않게 했습니다.
