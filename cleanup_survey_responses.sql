-- Script untuk menghapus data survey responses yang corrupt (questionId dan selectedOptionId = null)
-- Jalankan script ini di database untuk cleanup data lama

-- 1. Lihat data yang akan dihapus (untuk verifikasi)
SELECT 
    ra.id as answer_id,
    ra.response_id,
    ra.question_id,
    ra.selected_option_id,
    ir.instansi,
    ir.submitted_at
FROM response_answers ra
LEFT JOIN instrument_responses ir ON ra.response_id = ir.id
WHERE ra.question_id IS NULL OR ra.selected_option_id IS NULL;

-- 2. Hapus response answers yang corrupt
DELETE FROM response_answers 
WHERE question_id IS NULL OR selected_option_id IS NULL;

-- 3. Hapus instrument responses yang tidak punya answers lagi (orphaned)
DELETE FROM instrument_responses 
WHERE id NOT IN (
    SELECT DISTINCT response_id 
    FROM response_answers 
    WHERE response_id IS NOT NULL
);

-- 4. Verifikasi data sudah bersih
SELECT COUNT(*) as corrupt_answers_count
FROM response_answers 
WHERE question_id IS NULL OR selected_option_id IS NULL;

-- Seharusnya hasilnya 0 (tidak ada data corrupt lagi)
