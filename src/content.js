// Combina el curso original con las ampliaciones B1 sin modificar course-data.js.
import { courseData as baseData } from "./course-data.js";
import { expansions } from "./data/index.js";

// Algunas preguntas de reading/listening vienen como [pregunta, correcta,
// incorrectas[], explicación]. Se normalizan al formato que usa el visor.
function normalizeQuestion(question) {
  if (!Array.isArray(question)) return question;
  const [q, correct, wrong = [], explanation = ""] = question;
  return { q, options: [correct, ...wrong], answer: 0, explanation };
}

function normalizeLesson(lesson) {
  return {
    ...lesson,
    questions: lesson.questions?.map(normalizeQuestion),
    texts: lesson.texts?.map(text => ({
      ...text, questions: text.questions?.map(normalizeQuestion)
    })),
    tracks: lesson.tracks?.map(track => ({
      ...track, questions: track.questions?.map(normalizeQuestion)
    }))
  };
}

function mergeLevel(levelData, unitMap) {
  const units = levelData.units.map((unit, index) => {
    const replacement = unitMap[index];
    if (!replacement) return unit;
    const byId = new Map(replacement.map(lesson => [lesson.id, normalizeLesson(lesson)]));
    const lessons = unit.lessons.map(lesson => byId.get(lesson.id) || lesson);
    replacement.forEach(lesson => {
      if (!unit.lessons.some(original => original.id === lesson.id)) {
        console.warn("Lección ampliada sin equivalente en course-data.js:", lesson.id);
      }
    });
    return { ...unit, lessons };
  });
  return { ...levelData, units };
}

export const courseData = Object.fromEntries(
  Object.entries(baseData).map(([level, data]) => [level, mergeLevel(data, expansions[level] || {})])
);
