-- Drop unique constraint if it exists
ALTER TABLE "claim"
DROP CONSTRAINT IF EXISTS "claim_food_id_key";