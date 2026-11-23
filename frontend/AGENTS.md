# frontend/AGENTS.md (Next.js)

루트 AGENTS.md를 먼저 따른다. 아래는 프런트에만 해당한다.

## 구조
- src/app 은 얇게(주소별 화면 조립만). 기능은 src/features/{기능}/(components, hooks, api).
- 공통은 src/shared (UI, lib/money.ts).

## 서버 컴포넌트
- 기본은 서버 컴포넌트. 'use client'는 클릭·입력이 필요한 가장 작은 컴포넌트에만.
- 에러를 없애려고 페이지 맨 위에 'use client'를 붙이지 않는다.

## 데이터
- API 호출은 openapi-fetch + 자동 생성 타입. API 타입을 손으로 쓰지 않는다. 생성 파일은 수정 금지.
- 서버 데이터는 TanStack Query로만. Zustand에 복사하지 않는다(Zustand는 모달 열림 같은 화면 상태만).
- 폼은 React Hook Form + Zod. 브라우저 검사는 편의용이고 진짜 검사는 서버.

## 금액·표시
- 금액·수량 계산과 표시 변환은 shared/lib/money.ts 에서만, bigint로. parseFloat·Number() 금지.
- 주소는 EIP-55 형식으로 표시. 시간은 표시할 때만 KST로 바꾼다.

## ⭐ 송금·발행 화면
- Idempotency-Key는 화면을 열 때 만들고, 성공하면 새로 만든다. 버튼을 누를 때 만들지 않는다.
- 행동 버튼은 응답의 _links에 있을 때만 보여 준다.
- 에러는 detail을 보여 주고, 분기는 code로 한다. 메시지 문구로 분기하지 않는다.

## 지갑
- 수탁형이다. wagmi, MetaMask 연결, 브라우저 서명 코드를 넣지 않는다.

## 리뷰 기준 (토스 Frontend Fundamentals)
- 가독성: 복잡한 조건·매직 넘버에 이름을 붙인다.
- 예측 가능성: 이름에 없는 동작을 숨기지 않는다. 같은 종류 훅은 반환 모양을 맞춘다.
- 응집도: 함께 바뀌는 파일은 같은 기능 폴더에.
- 결합도: props를 여러 단계 내려보내지 않는다.
