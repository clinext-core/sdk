import askQuestion from './askQuestion.js'

export default async ({ toolbox, value }) => {

  const questions = Array.isArray(value) ? value : [value]
  const result = {}

  for (var _i in questions) {
    const question = questions[_i]
    const value = await askQuestion({ toolbox, question, questions })
    result[question.name] = value
    toolbox.payload[question.name] = value
  }

  return result
}

