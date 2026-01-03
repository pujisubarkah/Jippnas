-- Migration: Change score columns to numeric type to support decimal values

-- Change response_answers.original_score from integer to numeric(10, 2)
ALTER TABLE response_answers 
ALTER COLUMN original_score TYPE numeric(10, 2);

-- Change response_answers.verified_score from integer to numeric(10, 2)
ALTER TABLE response_answers 
ALTER COLUMN verified_score TYPE numeric(10, 2);

-- Update default values to use numeric format
ALTER TABLE response_answers 
ALTER COLUMN original_score SET DEFAULT 0.00;

ALTER TABLE response_answers 
ALTER COLUMN verified_score SET DEFAULT 0.00;
