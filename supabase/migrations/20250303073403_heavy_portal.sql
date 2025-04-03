/*
  # Update subscriptions table for payment tracking

  1. Changes
    - Add `payment_id` column to `subscriptions` table to track payment references
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add payment_id column to subscriptions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'payment_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN payment_id text;
  END IF;
END $$;