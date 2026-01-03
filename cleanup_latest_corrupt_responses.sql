-- Cleanup script for latest corrupt survey responses
-- These were created when questionId and optionId were undefined

-- First, check which responses have corrupt data (all null questionId/selectedOptionId)
SELECT 
    r.id as response_id,
    r.institution_name,
    r.created_at,
    COUNT(ra.id) as answer_count,
    COUNT(CASE WHEN ra."questionId" IS NULL THEN 1 END) as null_question_count,
    COUNT(CASE WHEN ra."selectedOptionId" IS NULL THEN 1 END) as null_option_count
FROM survey.instrument_responses r
LEFT JOIN survey.response_answers ra ON ra."responseId" = r.id
GROUP BY r.id, r.institution_name, r.created_at
HAVING COUNT(CASE WHEN ra."questionId" IS NULL THEN 1 END) = COUNT(ra.id)  -- All answers have null questionId
ORDER BY r.created_at DESC;

-- Delete the corrupt response_answers
-- (Uncomment when ready to delete)
-- DELETE FROM survey.response_answers
-- WHERE "responseId" IN (
--     SELECT r.id
--     FROM survey.instrument_responses r
--     LEFT JOIN survey.response_answers ra ON ra."responseId" = r.id
--     WHERE ra."questionId" IS NULL
--     GROUP BY r.id
-- );

-- Delete the corrupt instrument_responses
-- (Uncomment when ready to delete)
-- DELETE FROM survey.instrument_responses
-- WHERE id IN (
--     SELECT DISTINCT r.id
--     FROM survey.instrument_responses r
--     LEFT JOIN survey.response_answers ra ON ra."responseId" = r.id
--     WHERE ra."questionId" IS NULL OR NOT EXISTS (
--         SELECT 1 FROM survey.response_answers WHERE "responseId" = r.id
--     )
-- );
