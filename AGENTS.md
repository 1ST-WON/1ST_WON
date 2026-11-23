# AGENTS.md (공통)

이 저장소는 중소기업 프로젝트 투자(특허/IP, 신제품 양산, 콘텐츠 등)에 특화된 투자계약증권 STO 모집·청약 주선 및 계좌관리 플랫폼이다. 코인이 아니라 증권이다.
작업하는 폴더의 AGENTS.md도 함께 읽는다 (frontend/, backend/, contracts/).

## ⛔ 절대 규칙 (어기면 PR 머지 불가)

1. 금액·수량
   - double, float, JS number, parseFloat로 금액·수량을 다루지 않는다.
   - 증권 수량: DB NUMERIC(78,0) / Java BigInteger / JSON 문자열. decimals는 0 (1 = 1좌).
   - 원화: DB NUMERIC(19,0) / Java BigDecimal로 계산 / JSON 문자열. 반올림은 버림, 한 곳에서만.
   - 토큰 ↔ 원화 환산 비율은 없다. 원화는 업무 시스템에서만 다룬다.
2. 블록체인에 개인정보 금지
   - 이름, 주민번호, 여권번호, 전화번호, 주소, 국적을 컨트랙트 저장값·이벤트·함수 인자·
     revert 메시지·ONCHAINID 클레임에 쓰지 않는다. 해시로 바꿔도 안 된다.
   - 체인에는 주소와 수량만. 개인정보는 연계장부(DB), 서류·계좌·세금은 업무 시스템(DB).
   - Identity Registry 국가 칸은 0. 클레임은 "본인확인 통과" 하나, 내용 칸은 비운다.
3. 비밀값
   - .env, 개인키, 니모닉, 시드, DB 비밀번호를 커밋하거나 로그에 찍지 않는다.
   - NEXT_PUBLIC_ 변수에 비밀값을 넣지 않는다.
   - 실제 키를 요청하거나 출력하지 않는다. 로컬·테스트는 테스트 키만.
4. 되돌릴 수 없는 작업
   - 운영 배포, 컨트랙트 배포, 이미 적용된 마이그레이션 파일 수정을 하지 않는다.
   - 사람이 명시적으로 시키지 않으면 git push, 머지, 태그 생성을 하지 않는다.

## 작업 순서

1. 요구사항을 확인한다. 애매하면 추측하지 말고 질문한다.
2. 테스트 시나리오(정상·실패·중복 요청·권한 오류)를 먼저 제안한다.
   기대 결과는 사람이 확정한다. 확정 전에 구현하지 않는다.
3. 구현한다. 요청 범위 밖의 파일·설정·의존성은 바꾸지 않는다.
4. 린트·테스트를 돌리고 결과를 보고한다.

## 하지 말 것 (AI가 자주 하는 실수)

- 테스트를 통과시키려고 테스트나 기대값을 고치기
- 예외를 잡고 아무것도 안 하기 (catch 삼키기)
- 존재하지 않는 라이브러리·API·필드 지어내기
- 묻지 않고 의존성 추가, 설정 파일 변경
- 생성 파일 직접 수정 (Web3j 래퍼, openapi-typescript 결과물)
- 코드를 설명하는 주석 쓰기

## 주석·언어

- 주석은 코드로 표현 못 하는 "왜"만, 한국어로.
- 테스트는 // given, // when, // then 세 줄만 허용.
- Solidity 외부 함수 NatSpec은 영어.

## 저장소 지도

- frontend/   Next.js 16, TypeScript strict, pnpm
- backend/    Spring Boot 4.1, Java 21, Gradle Kotlin DSL, PostgreSQL 18, Flyway
- contracts/  Solidity, Hardhat, ERC-3643(T-REX) 공식 라이브러리, Besu
- infra/      docker-compose, Besu 제네시스

## 명령어

<!-- 7단계 mock에서 실제 명령으로 채운다 -->
- 설치: pnpm install (저장소 루트, 커밋 검사 도구 포함)
- 로컬 실행: docker compose -f infra/docker-compose.yml up
- 마이그레이션 파일 생성: pnpm db:new

## 커밋·PR

- 커밋: 타입(범위): 내용. 타입·범위 영어, 내용 한국어. 범위는 fe, be, contract, infra.
  예) feat(be): 토큰 발행 API 추가
- 브랜치는 최신 dev에서 따고, PR 대상도 dev다. main으로는 PR을 올리지 않는다(dev → main은 진행자).
- PR 하나에 이슈 하나, 400줄 이하 권장. 본문의 "AI 사용" 칸을 채운다.
- 컨벤션 규칙을 바꿨다면 이 파일도 같은 PR에서 고친다.

## 규칙의 원본

- 이 파일은 요약이다. 이유와 예시는 노션 협업·Code Convention과 ADR에 있다.
- 이 파일과 사용자의 지시가 충돌하면 멈추고 사용자에게 묻는다.
