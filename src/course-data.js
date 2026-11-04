
export const courseData = {
  B1: {
    subtitle: "Intermediate",
    description: "Desarrolla tu inglés para situaciones cotidianas, viajes y trabajo.",
    units: [
      {
        title: "Experiences and life events",
        goal: "Hablar de experiencias y acontecimientos pasados.",
        lessons: [
          {
            id: "b1-1",
            title: "Present perfect vs past simple",
            skill: "Grammar",
            duration: 15,
            intro: "Usamos present perfect para experiencias sin indicar cuándo ocurrieron. Usamos past simple para momentos pasados terminados.",
            vocab: [
              ["Have you ever…?", "¿Alguna vez has…?"],
              ["I went…", "Fui…"],
              ["I've never tried it.", "Nunca lo he probado."]
            ],
            question: "I ____ to London in 2022.",
            options: ["have been", "went", "has gone"],
            answer: 1,
            explanation: "In 2022 indica un momento pasado terminado: went."
          },
          {
            id: "b1-2",
            title: "Talking about experiences",
            skill: "Speaking",
            duration: 12,
            intro: "Para preguntar por experiencias puedes utilizar Have you ever…? y ampliar la respuesta con detalles.",
            vocab: [
              ["Actually", "En realidad"],
              ["It was amazing", "Fue increíble"],
              ["I was surprised", "Me sorprendió"]
            ],
            question: "Have you ever ____ sushi?",
            options: ["eat", "ate", "eaten"],
            answer: 2,
            explanation: "Después de have usamos el participio: eaten."
          }
        ]
      },
      {
        title: "Work and study",
        goal: "Describir rutinas y habilidades profesionales.",
        lessons: [
          {
            id: "b1-3",
            title: "For and since",
            skill: "Grammar",
            duration: 15,
            intro: "For se usa con una duración. Since se usa con el momento de inicio.",
            vocab: [
              ["For three years", "Durante tres años"],
              ["Since 2020", "Desde 2020"]
            ],
            question: "I've lived here ____ 2020.",
            options: ["for", "since", "during"],
            answer: 1,
            explanation: "Since acompaña al momento de inicio."
          }
        ]
      },
      {
        title: "Travel and everyday problems",
        goal: "Resolver situaciones prácticas.",
        lessons: [
          {
            id: "b1-4",
            title: "First conditional",
            skill: "Grammar",
            duration: 15,
            intro: "First conditional: If + present simple, will + infinitive.",
            vocab: [
              ["Unless", "A menos que"],
              ["As long as", "Siempre que"]
            ],
            question: "If it rains tomorrow, we ____ at home.",
            options: ["stay", "will stay", "would stayed"],
            answer: 1,
            explanation: "Para una posibilidad futura real usamos will stay."
          }
        ]
      }
    ]
  },

  B2: {
    subtitle: "Upper Intermediate",
    description: "Mejora tu capacidad para argumentar y comunicarte con precisión.",
    units: [
      {
        title: "Opinions and arguments",
        goal: "Expresar opiniones y justificar argumentos.",
        lessons: [
          {
            id: "b2-1",
            title: "Advanced linking words",
            skill: "Grammar",
            duration: 18,
            intro: "Utiliza however para contraste, furthermore para añadir información y therefore para expresar consecuencias.",
            vocab: [
              ["Nevertheless", "Sin embargo"],
              ["Furthermore", "Además"],
              ["Consequently", "En consecuencia"]
            ],
            question: "The plan is expensive. ____, it could save time.",
            options: ["Nevertheless", "Because", "Despite of"],
            answer: 0,
            explanation: "Nevertheless introduce un contraste."
          },
          {
            id: "b2-2",
            title: "Agreeing and disagreeing",
            skill: "Speaking",
            duration: 15,
            intro: "Para discrepar educadamente puedes decir I see your point, but…",
            vocab: [
              ["I see your point", "Entiendo tu argumento"],
              ["To some extent", "Hasta cierto punto"]
            ],
            question: "Which phrase expresses polite disagreement?",
            options: [
              "You're completely wrong.",
              "I see your point, but I have a different view.",
              "That's nonsense."
            ],
            answer: 1,
            explanation: "Reconoce la opinión contraria y expresa una discrepancia educada."
          }
        ]
      },
      {
        title: "Work, society and change",
        goal: "Analizar tendencias y cambios.",
        lessons: [
          {
            id: "b2-3",
            title: "Future forms",
            skill: "Grammar",
            duration: 17,
            intro: "Will expresa predicciones; going to indica intención o evidencia presente.",
            vocab: [
              ["Likely to", "Probable que"],
              ["Bound to", "Seguro que"]
            ],
            question: "Look at those clouds! It ____ rain.",
            options: ["will to", "is going to", "going"],
            answer: 1,
            explanation: "Las nubes son evidencia presente: is going to rain."
          }
        ]
      },
      {
        title: "Education, culture and the world",
        goal: "Desarrollar argumentos complejos.",
        lessons: [
          {
            id: "b2-4",
            title: "Essay structure",
            skill: "Writing",
            duration: 20,
            intro: "Un essay suele tener introducción, desarrollo de argumentos y conclusión.",
            vocab: [
              ["On balance", "En conjunto"],
              ["A key consideration", "Un aspecto clave"]
            ],
            question: "What should a conclusion normally do?",
            options: [
              "Introduce a new argument",
              "Summarise the main position",
              "Repeat the introduction word for word"
            ],
            answer: 1,
            explanation: "La conclusión resume la postura principal."
          }
        ]
      }
    ]
  }
};
