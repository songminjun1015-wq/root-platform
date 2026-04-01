-- 2. 기존 SELLER, BUYER 유저를 USER로 변환
UPDATE "User" SET "role" = 'USER' WHERE "role" IN ('SELLER', 'BUYER');
