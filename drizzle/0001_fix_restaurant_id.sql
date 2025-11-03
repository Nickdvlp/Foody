ALTER TABLE orders 
ALTER COLUMN restaurant_id TYPE uuid 
USING restaurant_id::uuid;
