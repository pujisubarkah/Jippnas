# Instrument Responses API

API endpoints untuk mengelola responses dari survey instrument.

## Endpoints

### 1. GET `/api/instrument-responses`
Mengambil semua responses yang sudah disubmit.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "instrumentId": 1,
      "instansi": "Dinas Kesehatan",
      "totalScore": 85,
      "verificationStatus": "pending",
      "submittedAt": "2026-01-01T10:00:00Z",
      "createdAt": "2026-01-01T10:00:00Z"
    }
  ]
}
```

### 2. POST `/api/instrument-responses`
Membuat response baru (basic).

**Body:**
```json
{
  "instrumentId": 1,
  "instansi": "Dinas Kesehatan",
  "totalScore": 85,
  "verificationStatus": "pending"
}
```

### 3. POST `/api/instrument-responses/submit`
Submit survey lengkap dengan semua jawaban.

**Body:**
```json
{
  "instrumentId": 1,
  "instansi": "Dinas Kesehatan",
  "answers": {
    "0-0": {
      "questionId": 1,
      "optionId": 2,
      "optionIndex": 1,
      "score": 5
    },
    "0-1": {
      "questionId": 2,
      "optionId": 5,
      "optionIndex": 2,
      "score": 3
    }
  },
  "evidences": {
    "0-0": [
      {
        "name": "bukti.pdf"
      }
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": {
      "id": 1,
      "instrumentId": 1,
      "instansi": "Dinas Kesehatan",
      "totalScore": 85,
      "verificationStatus": "pending",
      "submittedAt": "2026-01-01T10:00:00Z"
    },
    "answers": [
      {
        "id": 1,
        "responseId": 1,
        "questionId": 1,
        "selectedOptionId": 2,
        "evidence": "bukti.pdf",
        "originalScore": 5,
        "verifiedScore": 5
      }
    ],
    "totalScore": 85,
    "message": "Survey berhasil dikirim"
  }
}
```

## Flow

1. User mengisi survey di frontend ([role]/survey-hub-inovasi.vue)
2. Saat klik "Kirim", data dikirim ke endpoint `/api/instrument-responses/submit`
3. API akan:
   - Validasi data input
   - Hitung total score dari semua jawaban
   - Insert ke tabel `instrument_responses`
   - Insert semua jawaban ke tabel `response_answers`
   - Return response dengan total score
4. Frontend menampilkan dialog sukses dengan total score

## Database Schema

### instrument_responses
- id (serial, PK)
- instrumentId (integer, FK ke survey_instruments)
- instansi (varchar)
- totalScore (integer)
- verificationStatus (varchar) - 'pending', 'verified', 'rejected'
- submittedAt (timestamp)
- createdAt (timestamp)

### response_answers
- id (serial, PK)
- responseId (integer, FK ke instrument_responses)
- questionId (integer, FK ke instrument_questions)
- selectedOptionId (integer, FK ke question_options)
- evidence (text) - nama file bukti
- originalScore (integer) - score awal
- verifiedScore (integer) - score setelah verifikasi
- createdAt (timestamp)
