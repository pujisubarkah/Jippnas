-- Change total_score column from int4 to numeric to support decimal values
ALTER TABLE instrument_responses 
ALTER COLUMN total_score TYPE numeric(10, 2);
