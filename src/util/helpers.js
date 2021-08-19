function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

function arraySwapElements(questions, dragIndex, hoverIndex) {
  const dragQuestion = questions[dragIndex]
  questions.splice(dragIndex, 1)
  questions.splice(hoverIndex, 0, dragQuestion)
}

function copyProperties(newQuestion, oldQuestion) {
  newQuestion.id = oldQuestion.id
  newQuestion.text = oldQuestion.text
  newQuestion.variants = oldQuestion.variants
  newQuestion.texts = oldQuestion.texts
  newQuestion.columns = oldQuestion.columns
  newQuestion.questions = oldQuestion.questions
  newQuestion.scales = oldQuestion.scales
  return newQuestion
}

function newQuestion(type) {
  const newQuestion = {
    type: type,
    condition: null,
    dependent: null,
    headerTexts: null,
    id: `new${guid()}`,
    scales: null,
    text: 'Новый вопрос',
    variants: null,
    columns: null,
    texts: null,
    questions: null,
  }
  switch (type) {
    case 'variants':
    case 'radio':
    case 'check':
      newQuestion.variants = []
      break
    case 'variantGroup':
      newQuestion.texts = []
      newQuestion.columns = []
      break
    case 'group':
      newQuestion.questions = []
      newQuestion.text = 'Новая группа'
      break
    case 'variantTextGroup':
      newQuestion.scales = []
  }
  return newQuestion
}

export { guid, arraySwapElements, newQuestion, copyProperties }
