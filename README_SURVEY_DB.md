# Instrumen Survey Database Schema

## Overview
Sistem database untuk instrumen survey/kuesioner dengan fitur verifikasi jawaban dan bukti dukung.

## Struktur Tabel

### 1. survey_instruments
Tabel utama untuk menyimpan instrumen survey/kuesioner.
- `id`: Primary key
- `title`: Judul instrumen survey
- `description`: Deskripsi instrumen
- `is_active`: Status aktif/non-aktif
- `created_at`, `updated_at`: Timestamp

### 2. instrument_aspects
Tabel untuk menyimpan aspek dalam instrumen survey.
- `id`: Primary key
- `instrument_id`: Foreign key ke survey_instruments
- `name`: Nama aspek (contoh: "Kesiapan Sumber Daya")
- `sort_order`: Urutan tampilan

### 3. instrument_questions
Tabel untuk menyimpan pertanyaan dalam aspek.
- `id`: Primary key
- `aspect_id`: Foreign key ke instrument_aspects
- `question_text`: Teks pertanyaan
- `question_type`: 'single' atau 'multiple'
- `is_required`: Apakah wajib dijawab
- `require_evidence`: Apakah perlu bukti dukung
- `evidence_label`: Label untuk kolom bukti dukung
- `sort_order`: Urutan tampilan

### 4. question_options
Tabel untuk menyimpan pilihan jawaban dengan skor.
- `id`: Primary key
- `question_id`: Foreign key ke instrument_questions
- `option_text`: Teks pilihan jawaban
- `score`: Skor/nilai untuk pilihan ini
- `option_value`: Identifier (a, b, c, dll)
- `sort_order`: Urutan tampilan

### 5. instrument_responses
Tabel untuk menyimpan data responden instrumen.
- `id`: Primary key
- `instrument_id`: Foreign key ke survey_instruments
- `instansi`: Nama instansi responden
- `total_score`: Total skor keseluruhan
- `verification_status`: Status verifikasi ('pending', 'verified', 'rejected')
- `submitted_at`: Waktu pengisian
- `verified_at`: Waktu verifikasi

### 6. response_answers
Tabel untuk menyimpan jawaban responden.
- `id`: Primary key
- `response_id`: Foreign key ke instrument_responses
- `question_id`: Foreign key ke instrument_questions
- `selected_option_ids`: Array ID opsi (untuk multiple choice)
- `selected_option_id`: ID opsi tunggal (untuk single choice)
- `evidence`: Teks bukti dukung
- `original_score`: Skor asli responden
- `verified_score`: Skor setelah verifikasi

### 7. answer_verifications
Tabel untuk menyimpan hasil verifikasi.
- `id`: Primary key
- `answer_id`: Foreign key ke response_answers
- `verified_option_ids`: Array ID opsi terverifikasi
- `verified_option_id`: ID opsi tunggal terverifikasi
- `verification_status`: Status verifikasi
- `verification_note`: Catatan verifikasi
- `verified_by`: ID user verifikator
- `verified_at`: Waktu verifikasi

## Cara Penggunaan

1. **Jalankan script tabel utama:**
   ```sql
   -- Jalankan file survey_tables.sql di Navicat/pgAdmin
   ```

2. **(Opsional) Jalankan sample data:**
   ```sql
   -- Jalankan file survey_sample_data.sql untuk testing
   ```

3. **Integrasi dengan aplikasi:**
   - Gunakan API endpoints untuk CRUD operations
   - Pastikan foreign key constraints terjaga
   - Implementasi authentication untuk `verified_by`

## Relasi Tabel

```
survey_instruments (1) ──── (N) instrument_aspects
    │                              │
    └───────────────── (N) instrument_responses
                                   │
                                   └──── (N) response_answers
                                           │
                                           └──── (1) answer_verifications

instrument_aspects (1) ──── (N) instrument_questions
    │
    └───────── (N) instrument_questions

instrument_questions (1) ──── (N) question_options
    │
    └───────── (N) response_answers
```

## Indexes

- `idx_instruments_is_active`: Untuk filter instrumen aktif
- `idx_responses_instrument_id`: Untuk filter response per instrumen
- `idx_responses_verification_status`: Untuk filter status verifikasi
- `idx_answers_response_id`: Untuk query jawaban per response
- `idx_answers_question_id`: Untuk query jawaban per pertanyaan
- `idx_verifications_answer_id`: Untuk query verifikasi per jawaban

## Triggers

- `update_instruments_updated_at`: Auto-update kolom `updated_at` saat update survey_instruments

## Contoh Query

### Menampilkan instrumen aktif dengan aspek dan pertanyaan:
```sql
SELECT
    si.title,
    ia.name as aspect_name,
    iq.question_text,
    qo.option_text,
    qo.score
FROM survey_instruments si
JOIN instrument_aspects ia ON si.id = ia.instrument_id
JOIN instrument_questions iq ON ia.id = iq.aspect_id
JOIN question_options qo ON iq.id = qo.question_id
WHERE si.is_active = true
ORDER BY ia.sort_order, iq.sort_order, qo.sort_order;
```

### Menampilkan hasil response dengan verifikasi:
```sql
SELECT
    ir.instansi,
    si.title,
    ir.total_score,
    ir.verification_status,
    COUNT(ra.id) as total_questions,
    SUM(ra.verified_score) as verified_total_score
FROM instrument_responses ir
JOIN survey_instruments si ON ir.instrument_id = si.id
LEFT JOIN response_answers ra ON ir.id = ra.response_id
GROUP BY ir.id, si.title
ORDER BY ir.submitted_at DESC;
```