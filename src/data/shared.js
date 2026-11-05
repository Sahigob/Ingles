// Utilidades compartidas por los archivos de contenido.
// q(): crea una pregunta de opción múltiple colocando la respuesta correcta en la posición "pos" (0-3).
export function q(text, correct, wrongs, pos, explanation) {
  const options = [...wrongs];
  options.splice(pos, 0, correct);
  return { q: text, options, answer: pos, explanation };
}

export const writingRubricB1 = [
  ["Content", "All parts of the task are covered with relevant, developed ideas."],
  ["Communicative achievement", "Register (formal or informal) and format suit the text type; the reader understands the message easily."],
  ["Organisation", "Clear paragraphs and basic linking words (and, but, because, however, first, finally)."],
  ["Language", "Reasonable range of vocabulary and structures; verb forms are mostly accurate and errors do not block understanding."]
];

export const speakingCriteriaB1 = [
  ["Fluency and coherence", "You keep going despite some hesitation and link ideas with simple connectors."],
  ["Vocabulary", "You use topic vocabulary and can explain an idea when you do not know the exact word."],
  ["Grammar", "You control basic structures (including the tenses of this unit) with a few mistakes that do not affect meaning."],
  ["Pronunciation", "Your speech is generally clear; stress and intonation help the listener."],
  ["Task and interaction", "You answer every part of the task and react to your partner or examiner."]
];
