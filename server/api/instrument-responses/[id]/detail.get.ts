import { drizzle } from 'drizzle-orm/postgres-js'
import { eq, asc, isNotNull, and } from 'drizzle-orm'  // Tambah isNotNull, and
import postgres from 'postgres'
import { 
  instrumentResponses, 
  responseAnswers, 
  instrumentQuestions, 
  questionOptions,
  instrumentAspects,
  answerVerifications
} from '~/drizzle/schema/survey'

interface QuestionDetail {
  answerId: number;
  questionText: string;
  questionType: string;
  questionWeight: number | null;
  selectedOption: { value: string | null; text: string; score: number | null } | null;
  selectedOptions: { value: string | null; text: string; score: number | null }[];
  availableOptions: { value: string | null; text: string; score: number | null }[];
  evidence: string | null;
  originalScore: number | null;
  verifiedScore: number | null;
}

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id || '0')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid response ID'
      })
    }

    // Get response
    const [response] = await db
      .select()
      .from(instrumentResponses)
      .where(eq(instrumentResponses.id, id))

    if (!response) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Response not found'
      })
    }

    // Get all answers with related data - FILTER hanya yang questionId tidak null
    const answers = await db
      .select({
        answer: responseAnswers,
        question: instrumentQuestions,
        aspect: instrumentAspects,
        selectedOption: questionOptions,
      })
      .from(responseAnswers)
      .leftJoin(instrumentQuestions, eq(responseAnswers.questionId, instrumentQuestions.id))
      .leftJoin(instrumentAspects, eq(instrumentQuestions.aspectId, instrumentAspects.id))
      .leftJoin(questionOptions, eq(responseAnswers.selectedOptionId, questionOptions.id))
      .where(
        and(
          eq(responseAnswers.responseId, id),
          isNotNull(responseAnswers.questionId)  // <-- TAMBAH INI
        )
      )
      .orderBy(asc(instrumentAspects.sortOrder), asc(instrumentQuestions.sortOrder))

    console.log('🔍 DEBUG: Raw answers count:', answers.length)
    if (answers.length > 0) {
      console.log('🔍 DEBUG: First row sample:', JSON.stringify({
        answerId: answers[0].answer.id,
        questionId: answers[0].answer.questionId,
        selectedOptionId: answers[0].answer.selectedOptionId,
        hasQuestion: !!answers[0].question,
        hasAspect: !!answers[0].aspect,
        questionText: answers[0].question?.questionText?.substring(0, 50),
        aspectName: answers[0].aspect?.name
      }, null, 2))
    }

    // Get all available options for each question
    const questionIds = [...new Set(answers.map(a => a.question?.id).filter(Boolean))] as number[]
    
    console.log('🔍 DEBUG: Question IDs found:', questionIds)
    
    // Fetch all options for all questions
    const optionsMap = new Map<number, any[]>()
    for (const qId of questionIds) {
      const options = await db
        .select()
        .from(questionOptions)
        .where(eq(questionOptions.questionId, qId))
        .orderBy(asc(questionOptions.sortOrder))
      optionsMap.set(qId, options)
    }

    // Group by aspects
    const aspectsMap = new Map<string, { aspectName: string; aspectId: number; questions: QuestionDetail[] }>
    
    let skippedCount = 0
    for (const row of answers) {
      console.log('🔍 Processing row:', {
        answerId: row.answer.id,
        questionId: row.answer.questionId,
        hasAspect: !!row.aspect,
        hasQuestion: !!row.question,
        aspectId: row.aspect?.id,
        aspectName: row.aspect?.name
      })

      if (!row.aspect || !row.question) {
        console.log('⚠️ SKIPPED - Missing aspect or question!')
        skippedCount++
        continue
      }

      const aspectName = row.aspect.name
      if (!aspectsMap.has(aspectName)) {
        aspectsMap.set(aspectName, {
          aspectName,
          aspectId: row.aspect.id,
          questions: []
        })
      }

      const aspect = aspectsMap.get(aspectName)!
      const questionOptions = optionsMap.get(row.question.id) || []

      // Prepare selected answer data
      let selectedOption = null
      if (row.selectedOption) {
        selectedOption = {
          value: row.selectedOption.optionValue,
          text: row.selectedOption.optionText,
          score: row.selectedOption.score
        }
      }

      // Handle multiple selections for checkboxes
      let selectedOptions: any[] = []
      if (row.question.questionType === 'multiple' && row.answer.selectedOptionIds && row.answer.selectedOptionIds.length > 0) {
        const allQuestionOptions = optionsMap.get(row.question.id) || []
        selectedOptions = allQuestionOptions
          .filter(opt => row.answer.selectedOptionIds?.includes(opt.id))
          .map(opt => ({
            value: opt.optionValue,
            text: opt.optionText,
            score: opt.score
          }))
      } else if (row.question.questionType === 'single' && selectedOption) {
        // For single choice, also populate selectedOptions for consistency
        selectedOptions = [selectedOption]
      }

      aspect.questions.push({
        answerId: row.answer.id,
        questionText: row.question.questionText,
        questionType: row.question.questionType || '',
        questionWeight: row.question.weight ? parseFloat(row.question.weight) : null,
        selectedOption: selectedOption,
        selectedOptions: selectedOptions,
        availableOptions: questionOptions.map(opt => ({
          value: opt.optionValue,
          text: opt.optionText,
          score: opt.score
        })),
        evidence: row.answer.evidence,
        originalScore: row.answer.originalScore,
        verifiedScore: row.answer.verifiedScore || row.answer.originalScore,
      })
    }

    console.log('⚠️ Total skipped rows:', skippedCount)
    console.log('✅ Aspects map size:', aspectsMap.size)

    // Calculate scores
    const aspects = Array.from(aspectsMap.values())
    const originalTotalScore = answers.reduce((sum, row) => sum + (row.answer.originalScore || 0), 0)
    const verifiedTotalScore = answers.reduce((sum, row) => sum + (row.answer.verifiedScore || row.answer.originalScore || 0), 0)

    console.log('📊 API Response Detail:')
    console.log('  Response ID:', response.id)
    console.log('  Instansi:', response.instansi)
    console.log('  Total Aspects:', aspects.length)
    console.log('  Total Score:', originalTotalScore)
    aspects.forEach((aspect, idx) => {
      console.log(`  Aspect ${idx + 1}: ${aspect.aspectName}`)
      console.log(`    Questions: ${aspect.questions.length}`)
      aspect.questions.forEach((q, qIdx) => {
        console.log(`      Q${qIdx + 1}: ${q.questionText.substring(0, 50)}...`)
        console.log(`        Type: ${q.questionType}`)
        console.log(`        Selected: ${q.selectedOption?.text || 'None'}`)
        console.log(`        Available Options: ${q.availableOptions.length}`)
      })
    })

    return {
      success: true,
      data: {
        id: response.id,
        instansi: response.instansi,
        instrumentId: response.instrumentId,
        originalTotalScore,
        verifiedTotalScore,
        verificationStatus: response.verificationStatus,
        submittedAt: response.submittedAt,
        verifiedAt: response.verifiedAt,
        answers: aspects
      }
    }
  } catch (error: any) {
    console.error('Error fetching response detail:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch response details'
    })
  }
})
