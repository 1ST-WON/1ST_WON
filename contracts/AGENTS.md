# contracts/AGENTS.md (Solidity · Hardhat · Besu)

루트 AGENTS.md를 먼저 따른다. 배포된 컨트랙트는 고칠 수 없다.

## 토큰: ERC-3643(T-REX) 공식 라이브러리
- @erc3643org/erc-3643 을 정확한 버전으로 쓴다. 라이브러리 코드를 복사·수정하지 않는다.
- 토큰·Identity Registry·Compliance를 직접 구현하지 않는다.
- 새 종목은 공식 TREX Factory로만 만든다. decimals는 0.
- 업그레이드하지 않는다. Implementation Authority의 버전 변경 함수를 호출하는 코드를 쓰지 않는다.
- 우리 코드에 프록시(UUPS 등)를 만들지 않는다.

## 권한
- Owner(설정 변경)와 Agent(발행·동결·강제 이전·멈춤·투자자 등록)는 다른 키다.
- 하나의 키에 두 역할을 주지 않는다.

## 체인에 쓰는 것 (루트 절대 규칙 2의 구체화)
- 클레임 토픽은 "본인확인 통과" 하나, 클레임 data는 비운다.
- Identity Registry 국가 코드는 0.
- 이벤트·revert 메시지에 사람 정보를 넣지 않는다.
- 컴플라이언스 모듈은 추가하지 않는다. 추가는 ADR이 필요하다.

## 컴파일러
- 모든 Solidity 파일: pragma solidity 0.8.17; (정확한 버전, ^ 금지. 공식 라이브러리와 같은 버전)
- evmVersion은 infra/besu 제네시스와 맞춘다. 다른 컴파일러 버전을 추가하지 않는다.

## 배포
- 로컬(Hardhat·로컬 Besu) 외 네트워크에 배포하는 명령을 실행하지 않는다. 운영 배포는 CI만.
- deployments/{network}.json 은 CI가 쓴다. 손으로 고치지 않는다.
- ABI는 contracts/abi/ 로 추출해 커밋한다. artifacts/ 는 커밋하지 않는다.

## 코드·테스트
- 외부 함수에 영어 NatSpec.
- 필수 테스트: 미등록·도장 없는 주소로 이전 거부, 동결 수량 초과 거부,
  Agent가 아닌 계정의 강제 이전 거부, 팩토리로 만든 종목의 decimals = 0.
- solhint, Slither를 통과해야 한다.
