-- ==========================================
-- is_active 값 업데이트 마이그레이션
-- 모든 상품의 is_active를 true로 설정
-- ==========================================

-- 모든 상품의 is_active를 true로 업데이트
UPDATE products 
SET is_active = true 
WHERE is_active IS NULL OR is_active = false;

