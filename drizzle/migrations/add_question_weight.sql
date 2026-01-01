-- Add weight column to instrument_questions table
ALTER TABLE instrument_questions 
ADD COLUMN weight NUMERIC(5,2) DEFAULT 1.00;

-- Update weights for existing questions (example values based on your requirements)
-- Aspek 1: 0.35, 0.31, 0.34
-- Aspek 2: 0.4, 0.29, 0.31
-- Aspek 3: 0.6, 0.4
-- Aspek 4: 0.66, 0.34

-- Note: You'll need to update the question IDs based on your actual data
-- Example:
-- UPDATE instrument_questions SET weight = 0.35 WHERE id = 1 AND aspect_id = 1;
-- UPDATE instrument_questions SET weight = 0.31 WHERE id = 2 AND aspect_id = 1;
-- UPDATE instrument_questions SET weight = 0.34 WHERE id = 3 AND aspect_id = 1;
