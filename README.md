# ROOT

물류·건설 산업의 유휴 자산 등록, 구매 요청 접수, 운영자 중심 매칭, 딜 상태 관리를 위한 B2B 플랫폼.

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| ORM | Prisma |
| DB | PostgreSQL |

---

## 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.example`을 복사하여 `.env`를 만들고 실제 값으로 채웁니다.

```bash
cp .env.example .env
```

`DATABASE_URL`을 실제 PostgreSQL 연결 문자열로 수정합니다.

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/root_db"
```

### 3. Prisma 클라이언트 생성

```bash
npm run db:generate
```

### 4. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인합니다.

---

## 폴더 구조

```
ROOT/
├── app/                  # Next.js App Router 페이지 및 레이아웃
│   ├── layout.tsx        # 전역 레이아웃
│   ├── page.tsx          # 홈 페이지
│   └── globals.css       # 전역 스타일 (Tailwind 포함)
│
├── components/           # 재사용 가능한 UI 컴포넌트
│
├── lib/
│   └── prisma.ts         # Prisma 클라이언트 싱글톤
│
├── prisma/
│   └── schema.prisma     # DB 스키마 정의
│
├── types/
│   └── index.ts          # 공통 타입 정의
│
├── .env                  # 환경변수 (git 제외)
├── .env.example          # 환경변수 예시
└── README.md
```

---

## 다음 개발 단계

### Step 1 — Prisma 스키마 작성

`prisma/schema.prisma`에 핵심 도메인 모델을 정의합니다.

```
Asset          유휴 자산 (종류, 수량, 지역, 상태)
PurchaseRequest  구매 요청 (품목, 수량, 요청자)
Deal           매칭된 딜 (자산↔요청, 상태, 운영자)
Operator       운영자 계정
```

스키마 작성 후 DB에 반영:

```bash
npm run db:push
npm run db:generate
```

### Step 2 — 핵심 페이지 구현

- `/assets` — 유휴 자산 목록 및 등록
- `/requests` — 구매 요청 목록 및 접수
- `/deals` — 딜 현황 (운영자 전용)

### Step 3 — Server Actions 및 API

- 자산 등록 / 조회
- 구매 요청 등록 / 조회
- 딜 생성 / 상태 변경 (운영자)
