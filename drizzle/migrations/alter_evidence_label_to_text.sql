-- Change evidence_label column from varchar(255) to text to accommodate longer text
ALTER TABLE instrument_questions 
ALTER COLUMN evidence_label TYPE text;
