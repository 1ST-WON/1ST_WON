#!/usr/bin/env bash

set -e

psql -X -v ON_ERROR_STOP=1 \
    --username "$POSTGRES_USER" \
    --dbname "$POSTGRES_DB" <<'EOSQL'

BEGIN;

-- 환경변수 불러오기
\getenv db_name POSTGRES_DB
\getenv issuer_user ISSUER_DB_USER
\getenv issuer_password ISSUER_DB_PASSWORD
\getenv broker_user BROKER_DB_USER
\getenv broker_password BROKER_DB_PASSWORD
\getenv mts_user MTS_DB_USER
\getenv mts_password MTS_DB_PASSWORD
\getenv migration_user MIGRATION_DB_USER
\getenv migration_password MIGRATION_DB_PASSWORD

-- 1. 서비스별 DB 계정 생성
CREATE ROLE :"issuer_user"
    WITH LOGIN PASSWORD :'issuer_password';

CREATE ROLE :"broker_user"
    WITH LOGIN PASSWORD :'broker_password';

CREATE ROLE :"mts_user"
    WITH LOGIN PASSWORD :'mts_password';

-- 2. 마이그레이션 전용 계정 생성
CREATE ROLE :"migration_user"
    WITH LOGIN PASSWORD :'migration_password';

-- 3. 기본 접근 권한 제한
REVOKE ALL ON DATABASE :"db_name" FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM PUBLIC;

-- 4. Database 접속 권한 부여
GRANT CONNECT ON DATABASE :"db_name"
    TO :"issuer_user",
       :"broker_user",
       :"mts_user",
       :"migration_user";

-- 5. 서비스 전용 Schema 생성
CREATE SCHEMA IF NOT EXISTS issuer
    AUTHORIZATION :"migration_user";

CREATE SCHEMA IF NOT EXISTS broker
    AUTHORIZATION :"migration_user";

CREATE SCHEMA IF NOT EXISTS mts
    AUTHORIZATION :"migration_user";

-- 6. 공유 Schema 생성
CREATE SCHEMA IF NOT EXISTS corp
    AUTHORIZATION :"migration_user";

CREATE SCHEMA IF NOT EXISTS investment
    AUTHORIZATION :"migration_user";

CREATE SCHEMA IF NOT EXISTS ledger
    AUTHORIZATION :"migration_user";

-- 7. 서비스 전용 Schema 접근 권한
GRANT USAGE ON SCHEMA issuer TO :"issuer_user";
GRANT USAGE ON SCHEMA broker TO :"broker_user";
GRANT USAGE ON SCHEMA mts TO :"mts_user";

-- 8. 기업 및 사업 프로젝트 Schema 접근 권한
GRANT USAGE ON SCHEMA corp
    TO :"issuer_user", :"broker_user";

-- 9. 증권 및 투자 Schema 접근 권한
GRANT USAGE ON SCHEMA investment
    TO :"issuer_user", :"broker_user", :"mts_user";

-- 10. 블록체인 및 연계장부 Schema 접근 권한
GRANT USAGE ON SCHEMA ledger
    TO :"broker_user";

-- 11. Flyway 마이그레이션 이력 전용 Schema 생성
CREATE SCHEMA IF NOT EXISTS flyway_history
    AUTHORIZATION :"migration_user";

REVOKE ALL ON SCHEMA flyway_history FROM PUBLIC;

COMMIT;

EOSQL

echo "WONCOIN database initialization completed."
