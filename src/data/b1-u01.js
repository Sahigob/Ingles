import { q, writingRubricB1, speakingCriteriaB1 } from "./shared.js";

// B1 · Unit 1: Experiences and life events
// 25 grammar + 25 vocabulary + 3x5 reading + 3x5 listening + 5 writing + 5 speaking = 90 actividades.
// Los ids de las lecciones son los mismos que ya existen en course-data.js.

export default [
  {
    id: "b1-1",
    title: "Present perfect and past simple",
    skill: "Grammar",
    type: "grammar",
    duration: 35,
    intro: "Learn when to use the present perfect and when to use the past simple to talk about experiences and life events. Read the rule and the examples, then answer the 25 questions. They get gradually harder.",
    rule: "Use the PRESENT PERFECT (have/has + past participle) for experiences up to now when the exact time is not important (I've been to Rome), for unfinished periods of time (this week, so far, for, since) and for recent events with a result in the present. Use the PAST SIMPLE for finished events at a definite time in the past (yesterday, last year, in 2019, two days ago, when I was ten). Often we start with the present perfect (Have you ever been to Japan?) and then give details in the past simple (Yes, I went there in 2019).",
    examples: [
      ["Experience up to now", "I've visited three countries so far."],
      ["Finished time", "I visited Portugal in 2021."],
      ["Unfinished period", "She has lived here since 2018."],
      ["Question + details", "Have you ever met a famous person? – Yes, I met an actor last summer."],
      ["Been / gone", "He's been to Paris (he came back). He's gone to Paris (he is still there)."]
    ],
    vocab: [
      ["ever / never", "in your life up to now (Have you ever…? I've never…)"],
      ["so far / up to now", "until this moment"],
      ["already / yet / just", "present perfect signals (already in statements, yet in questions and negatives)"],
      ["for + period / since + point", "for ten years / since 2015"],
      ["yesterday / last year / in 2019 / ago", "finished-time words: they need the past simple"]
    ],
    questions: [
      q("I ____ to Italy three times so far.", "have been", ["went", "was", "go"], 2, "'So far' conecta el pasado con el presente, así que usamos el present perfect: have + participio pasado."),
      q("We ____ to Paris last summer.", "went", ["have been", "have gone", "go"], 0, "'Last summer' es un tiempo pasado terminado, así que usamos el past simple."),
      q("____ you ever eaten sushi?", "Have", ["Did", "Do", "Were"], 3, "'Ever' pregunta por experiencias de tu vida hasta ahora: Have you ever + participio pasado?"),
      q("I've already ____ the report.", "written", ["wrote", "write", "writing"], 1, "El present perfect necesita el participio pasado. Write – wrote – written."),
      q("When ____ you first meet your best friend?", "did", ["have", "do", "had"], 2, "'When' pregunta por un momento pasado ya terminado: did + infinitivo."),
      q("He ____ in London since 2019.", "has lived", ["lives", "lived", "is living"], 3, "'Since 2019' indica desde un punto del pasado hasta ahora, por eso usamos el present perfect."),
      q("I ____ her yesterday.", "saw", ["have seen", "see", "have been seeing"], 0, "'Yesterday' es un tiempo terminado, así que usamos el past simple: saw."),
      q("How long ____ this car?", "have you had", ["do you have", "are you having", "did you have"], 1, "'How long' con una situación que continúa ahora requiere el present perfect: have you had."),
      q("My grandparents ____ married in 1965.", "got", ["have got", "have been getting", "get"], 2, "'In 1965' es un momento concreto del pasado, así que usamos el past simple: got married."),
      q("It's the first time I ____ skiing.", "have been", ["went", "was", "am going"], 3, "Después de 'It's the first time…' usamos el present perfect: It's the first time I have been skiing."),
      q("Which sentence is correct?", "I visited Rome last year.", ["I have visited Rome last year.", "I have been visiting Rome last year.", "I am visiting Rome last year."], 1, "'Last year' es un tiempo terminado, por lo que no se puede usar el present perfect. Hay que usar el past simple."),
      q("Which sentence is correct?", "She has lived here for ten years.", ["She lives here for ten years.", "She lived here since ten years.", "She is living here since ten years."], 2, "Para una acción que empezó en el pasado y continúa ahora, con 'for' + periodo, usamos el present perfect."),
      q("I ____ my phone two days ago.", "lost", ["have lost", "have been losing", "am losing"], 0, "'Two days ago' indica un momento terminado, así que usamos el past simple."),
      q("Dan has never ____ abroad.", "travelled", ["travelling", "travel", "travels"], 3, "Has/have + participio pasado. El participio de travel es travelled (travelled en inglés británico, traveled en americano)."),
      q("Which time expression is normally used with the present perfect?", "so far", ["yesterday", "in 2018", "two weeks ago"], 1, "'So far' conecta pasado y presente. Yesterday, in 2018 y two weeks ago son momentos terminados (past simple)."),
      q("Which expression can only be used with the past simple, not with the present perfect?", "last weekend", ["so far", "this week", "never"], 2, "'Last weekend' es un periodo terminado, así que necesita el past simple. 'This week' puede usarse con ambos tiempos, según el significado."),
      q("I'm still in the same job. I ____ here for five years.", "have worked", ["worked", "was working", "am working"], 3, "La situación no ha terminado ('still') y 'for five years' mide el tiempo hasta ahora: present perfect."),
      q("My uncle ____ in Canada for ten years, but he moved back to Spain in 2015.", "lived", ["has lived", "lives", "has been living"], 0, "Ya no vive en Canadá. El periodo está terminado, así que usamos el past simple."),
      q("We ____ our exams last week, and now we are waiting for the results.", "did", ["have done", "do", "are doing"], 2, "'Last week' es un tiempo terminado: past simple."),
      q("A: Have you ever been to Japan? B: Yes, I have. I ____ there in 2019.", "went", ["go", "have gone", "have been going"], 1, "Después de la pregunta en present perfect, damos los detalles de un hecho terminado con el past simple."),
      q("I haven't seen him ____ last Christmas.", "since", ["for", "ago", "during"], 0, "'Since' se usa con un punto en el tiempo (last Christmas). 'For' se usa con un periodo (for six months)."),
      q("He ____ his leg while he was skiing last winter.", "broke", ["has broken", "breaks", "has been breaking"], 3, "'Last winter' es un tiempo terminado, así que usamos el past simple: broke."),
      q("Where's Tom? – He's ____ to the bank. He'll be back soon.", "gone", ["been", "went", "go"], 2, "'Has gone' significa que todavía está allí. 'Has been' significaría que ya ha vuelto."),
      q("I'm 45 and I ____ in this town all my life.", "have lived", ["lived", "am living", "was living"], 1, "Sigue viviendo allí y 'all my life' llega hasta el presente, así que usamos el present perfect."),
      q("Which sentence is grammatically correct?", "Since I was a child, I have loved music.", ["Since I was a child, I loved music.", "Since I am a child, I have loved music.", "Since I was a child, I am loving music."], 3, "'Since' + past simple (el punto de partida) va seguido del present perfect para la situación que continúa ahora.")
    ]
  },

  {
    id: "b1-u01-vocabulary",
    title: "Vocabulary: experiences, achievements, memorable events",
    skill: "Vocabulary",
    type: "vocabulary",
    duration: 30,
    intro: "Learn useful collocations, phrasal verbs, expressions and word families for talking about experiences and life events. Study the list and then answer the 25 questions.",
    vocab: [
      ["get married", "to start a marriage"],
      ["grow up", "to change from a child to an adult"],
      ["take up (a hobby)", "to start doing something new"],
      ["give up", "to stop doing something"],
      ["bump into (someone)", "to meet someone by chance"],
      ["get over (an illness)", "to recover from it"],
      ["settle down", "to start a stable life in one place"],
      ["overcome (a difficulty)", "to succeed in dealing with a problem"],
      ["a milestone", "an important moment in life"],
      ["a turning point", "a moment when something important changes"],
      ["once in a lifetime", "something that happens only once"],
      ["achieve a goal / achievement", "to succeed in reaching an aim / the success itself"],
      ["adventurous", "willing to try new, exciting things"],
      ["disappointed", "sad because something was not as good as you expected"]
    ],
    questions: [
      q("They ____ married in a small village church.", "got", ["became", "made", "did"], 1, "La colocación correcta es get married."),
      q("My sister ____ up the guitar when she was twelve, and she still plays it.", "took", ["gave", "put", "set"], 3, "'Take up' significa empezar una afición o actividad nueva."),
      q("A memorable event is an event that is ____.", "worth remembering", ["easy to forget", "very boring", "dangerous"], 0, "Memorable significa lo bastante especial como para recordarse."),
      q("Which word is the opposite of 'success'?", "failure", ["fortune", "progress", "achievement"], 2, "Failure (fracaso) es lo contrario de success (éxito)."),
      q("Winning the race was a great ____ for her.", "achievement", ["achieved", "achievable", "achieves"], 1, "Después de 'a great' necesitamos un sustantivo: achievement."),
      q("We grew ____ in the same neighbourhood.", "up", ["out", "off", "over"], 2, "'Grow up' significa pasar de la infancia a la edad adulta."),
      q("Passing my driving test was a real ____ for me.", "milestone", ["handle", "ceiling", "margin"], 3, "Un milestone es una etapa o un hecho importante en la vida."),
      q("You should ____ advantage of every opportunity to practise English.", "take", ["make", "do", "give"], 1, "La colocación correcta es take advantage of something (aprovechar algo)."),
      q("She always ____ her best in interviews.", "does", ["makes", "puts", "has"], 0, "La colocación correcta es do your best (hacer todo lo posible)."),
      q("A 'thrilling' experience is ____.", "very exciting", ["very boring", "rather tiring", "slightly worrying"], 2, "Thrilling significa muy emocionante."),
      q("I'm really looking ____ to my graduation.", "forward", ["ahead", "towards", "up"], 3, "'Look forward to' significa esperar algo con ilusión."),
      q("Seeing the northern lights was a once-in-a-____ experience.", "lifetime", ["moment", "season", "era"], 1, "'Once in a lifetime' describe algo que ocurre una sola vez en la vida."),
      q("He felt very ____ after losing the match.", "disappointed", ["disappointing", "disappointment", "disappoint"], 2, "Necesitamos un adjetivo que describa un sentimiento: disappointed (el partido fue disappointing, 'decepcionante')."),
      q("Which word is the opposite of 'ordinary'?", "extraordinary", ["common", "regular", "typical"], 0, "Extraordinary significa muy poco habitual o especial."),
      q("She has ____ many difficulties, but she never gave up.", "overcome", ["overtaken", "overlooked", "overdone"], 3, "Overcome a difficulty = conseguir superar un problema."),
      q("He ____ up his job to travel around the world.", "gave", ["put", "took", "set"], 1, "'Give up' significa dejar de hacer algo, por ejemplo un trabajo."),
      q("To 'settle down' means ____.", "to start a stable life in one place", ["to travel to many countries", "to change your job often", "to move to a bigger city"], 2, "Settle down = empezar una vida estable y tranquila, normalmente en un solo lugar y a menudo formando una familia."),
      q("I'm sure you'll ____ your driving test if you practise.", "pass", ["make", "win", "gain"], 3, "Un examen se 'pasa' (pass) o se 'suspende' (fail)."),
      q("She's a very ____ person; she loves trying new things.", "adventurous", ["adventure", "adventurously", "adventured"], 1, "Después de 'very' necesitamos un adjetivo: adventurous (aventurero)."),
      q("Moving to Berlin was a turning ____ in his career.", "point", ["step", "line", "edge"], 0, "Un turning point es un momento en el que una situación cambia de forma importante."),
      q("After years of hard work, she finally ____ her dream of becoming a doctor.", "achieved", ["solved", "discovered", "created"], 2, "Se 'achieve' un sueño, un objetivo o una ambición (se consigue)."),
      q("Yesterday I bumped into an old school friend. 'Bump into someone' means to ____.", "meet them by chance", ["argue with them", "phone them", "visit them on purpose"], 3, "Bump into = encontrarse con alguien por casualidad."),
      q("'He has been through a lot' means he has ____.", "experienced difficult situations", ["travelled a long way", "spent a lot of money", "studied for many years"], 1, "Go through something = pasar por una situación difícil."),
      q("We ____ a fantastic time at the festival.", "had", ["made", "did", "took"], 2, "La colocación correcta es have a good/fantastic time (pasarlo muy bien)."),
      q("'To get over an illness' means to ____.", "recover from it", ["catch it", "avoid it", "ignore it"], 0, "Get over = recuperarse de una enfermedad o de una mala experiencia.")
    ]
  },

  {
    id: "b1-u01-reading",
    title: "Reading: three texts about life experiences",
    skill: "Reading",
    type: "reading",
    duration: 35,
    intro: "Read three different texts: a blog, a magazine article and an email. After each text, answer five questions about the main idea, details, inference and vocabulary in context.",
    texts: [
      {
        title: "A year in Valencia (blog)",
        passage: "When I finished university, I didn't know what to do next. Most of my friends went straight into jobs, but I felt I needed a break from studying. So I decided to spend a year in Valencia as an English assistant in a secondary school.\n\nAt first, everything was difficult. I had studied Spanish for six years, yet I could hardly understand people in the street because they spoke so fast. I also felt lonely during the first month. Things changed when I joined a local volleyball team. The players were patient with my mistakes and invited me to their family lunches.\n\nBy the end of the year, I was dreaming in Spanish. I've been back to Spain four times since then, and I still write to my teammates every month. Looking back, it wasn't the work experience that changed me, but the friendships.",
        questions: [
          q("What is the writer mainly doing in the text?", "Describing how a year abroad changed her", ["Explaining why university is difficult", "Advertising a language course", "Comparing two Spanish cities"], 2, "Todo el texto cuenta la historia de su año en Valencia y lo que significó para ella."),
          q("Why did the writer go to Valencia?", "She felt she needed a break from studying.", ["She could not find a job at home.", "Her friends were already living there.", "She won a scholarship."], 0, "El texto dice que sentía que necesitaba un descanso de los estudios."),
          q("What helped her to feel less lonely?", "Joining a volleyball team", ["Calling her friends every day", "Moving into a new flat", "Studying Spanish harder"], 3, "Las cosas cambiaron cuando se unió a un equipo local de voleibol."),
          q("In the sentence 'I could hardly understand people', 'hardly' means ____.", "almost not at all", ["very easily", "only slowly", "quite well"], 1, "Hardly = casi no. Le resultaba muy difícil entender a la gente."),
          q("What does the writer suggest at the end of the text?", "The friendships she made mattered more than the job.", ["She should have found a job in Spain.", "The work experience was the best part.", "She no longer speaks Spanish."], 2, "Dice que no fue la experiencia laboral lo que la cambió, sino las amistades.")
        ]
      },
      {
        title: "Starting again at forty-two (magazine article)",
        passage: "Last spring, Tom Hardy, a 42-year-old accountant from Leeds, did something he had avoided all his life: he learned to swim.\n\nAs a child, he had a frightening experience at a public pool, and since then he has refused to go near deep water. 'I used to make excuses on every beach holiday,' he admits. Everything changed when his daughter, Ella, started swimming lessons and asked him to join her.\n\nAt first he was embarrassed to be the only adult in the class, but his instructor, Maria, made him feel relaxed. After eight weeks, Tom swam his first length. 'I cried a little,' he says, laughing. He has since signed up for a charity swim next June. 'It isn't about speed,' he says. 'It's about proving to yourself that it's never too late.'",
        questions: [
          q("What had Tom avoided all his life?", "Swimming", ["Driving", "Travelling by plane", "Going on beach holidays"], 1, "Había evitado aprender a nadar. Iba a la playa de vacaciones, pero ponía excusas."),
          q("Why did Tom decide to take lessons?", "His daughter asked him to join her.", ["His doctor advised it.", "He wanted to lose weight.", "His employer paid for it."], 3, "Todo cambió cuando su hija empezó las clases y le pidió que se apuntara con ella."),
          q("How did Tom feel at the beginning of the course?", "Embarrassed", ["Proud", "Bored", "Angry"], 0, "Al principio le daba vergüenza ser el único adulto de la clase (embarrassed = avergonzado)."),
          q("'Signed up for' in the text means ____.", "registered to take part in", ["refused to join", "finished", "paid for"], 2, "Sign up for = inscribirse en una actividad o evento."),
          q("What is the main message of the article?", "It is never too late to face your fears.", ["Swimming is only for young people.", "Parents should avoid lessons with their children.", "Accountants need more hobbies."], 1, "Tom dice que se trata de demostrarse a uno mismo que nunca es tarde.")
        ]
      },
      {
        title: "Big changes (informal email)",
        passage: "Hi Jamie,\n\nSorry I haven't written for ages! So much has happened since we last spoke. In March I finally left my job at the bank. I had been thinking about it for months, and when my manager offered me a promotion, I realised I didn't want it. I told my parents first, and they were less shocked than I expected.\n\nSince April, I've been working at a small bakery near the station. The hours are early and the pay is lower, but I've never felt so happy at work. Last Saturday, I even invented a new recipe for lemon bread, and the owner put it on the menu!\n\nI know it's a big change, but I think I've made the right decision. Anyway, are you still planning to visit in July? Tell me your dates and I'll book the days off.\n\nLove,\nNina",
        questions: [
          q("Why is Nina writing to Jamie?", "To tell him about recent changes in her life", ["To ask him for a job", "To complain about her manager", "To cancel a visit"], 1, "Dice que le han pasado muchas cosas y después le cuenta que dejó el banco y su nuevo trabajo."),
          q("What made Nina realise she wanted to leave the bank?", "Being offered a promotion", ["Losing her job", "An argument with her parents", "Moving to a new city"], 2, "Cuando su jefe le ofreció un ascenso, se dio cuenta de que no lo quería."),
          q("How did Nina's parents react?", "They were less shocked than she had expected.", ["They were very angry.", "They refused to speak to her.", "They offered her money."], 0, "Dice que se sorprendieron menos de lo que ella esperaba."),
          q("How does Nina feel about her new job?", "Happy, although she earns less", ["Worried about the early hours", "Disappointed with the bakery", "Unsure about her decision"], 3, "Nunca se había sentido tan feliz en el trabajo y cree que tomó la decisión correcta, aunque cobra menos."),
          q("What does 'book the days off' mean?", "Arrange to be free from work on those days", ["Buy train tickets for those days", "Leave her job for a week", "Reserve a hotel for Jamie"], 1, "Book days off = acordar con tu empresa no trabajar esos días.")
        ]
      }
    ]
  },

  {
    id: "b1-u01-listening",
    title: "Listening: three conversations about life events",
    skill: "Listening",
    type: "listening",
    duration: 35,
    intro: "Listen to three recordings: a dialogue between friends, a radio interview and a speech. You can play each one as many times as you like. After answering, you can read the transcript. The audio is read by your browser's synthetic voice.",
    tracks: [
      {
        title: "After the festival (dialogue)",
        transcript: "Mark: Hi, Laura! You look tired. How was the festival?\nLaura: Amazing, but exhausting! We arrived on Friday afternoon and put up the tent in the rain.\nMark: Oh no. Did you have any problems?\nLaura: Just one. Sophie lost her phone on Saturday morning, but a stranger found it and handed it in at the information tent.\nMark: Lucky! Have you ever been to a festival before?\nLaura: No, it was my first time. I've been to concerts, of course, but never anything like this. The best moment was the final night, when the band played my favourite song and everyone sang along.\nMark: Sounds fantastic. Would you go again?\nLaura: Definitely. We've already started planning for next year.",
        questions: [
          q("When did Laura and her friends arrive at the festival?", "On Friday afternoon", ["On Saturday morning", "On Friday night", "On Sunday afternoon"], 1, "Laura dice que llegaron el viernes por la tarde."),
          q("What happened to Sophie's phone?", "She lost it, but someone handed it in.", ["It was stolen from the tent.", "It broke in the rain.", "She left it at home."], 3, "Un desconocido lo encontró y lo entregó en la tienda de información."),
          q("What does Laura say about festivals?", "It was her first one.", ["She goes to one every year.", "She has never liked them.", "She went with Mark last year."], 0, "Dice que fue la primera vez que iba a un festival."),
          q("What was the best moment for Laura?", "The band playing her favourite song on the last night", ["Putting up the tent", "Finding Sophie's phone", "Meeting the band"], 2, "El mejor momento fue la última noche, cuando el grupo tocó su canción favorita."),
          q("What are Laura and her friends doing now?", "Planning to go again next year", ["Looking for a different festival", "Waiting for their tickets to arrive", "Writing about the trip"], 1, "Laura dice que ya han empezado a planificar el del año que viene.")
        ]
      },
      {
        title: "My first marathon (radio interview)",
        transcript: "Presenter: Today I'm talking to Hannah Cole, who ran her first marathon last month. Hannah, welcome.\nHannah: Thank you.\nPresenter: Had you always been a runner?\nHannah: Not at all! I hated sport at school. I only started running two years ago, after I moved to a new city and wanted to meet people. I joined a running club and, little by little, I got fitter.\nPresenter: And when did you decide to run a marathon?\nHannah: Last January. My father had been ill, and I wanted to raise money for the hospital that looked after him. In the end, I raised over three thousand pounds.\nPresenter: How was the race itself?\nHannah: Hard! I nearly gave up at kilometre thirty, but the crowd kept shouting my name. I finished in just under five hours, and I've never been so proud.",
        questions: [
          q("Why did Hannah start running?", "To meet people in a new city", ["To lose weight", "Because a doctor told her to", "To prepare for a marathon"], 2, "Empezó a correr tras mudarse a una ciudad nueva, porque quería conocer gente."),
          q("What did Hannah think about sport at school?", "She disliked it.", ["She was the captain of the team.", "She was quite good at it.", "She did not do any because of an illness."], 0, "Dice que odiaba el deporte en el colegio."),
          q("Why did Hannah run the marathon?", "To raise money for a hospital", ["To win a prize", "To beat her father's record", "To get a place in a club"], 3, "Quería recaudar dinero para el hospital que cuidó a su padre."),
          q("When did she nearly give up?", "At kilometre thirty", ["At the start", "At kilometre twenty", "Near the finish line"], 1, "Estuvo a punto de rendirse en el kilómetro treinta."),
          q("How long did the race take her?", "Just under five hours", ["About three hours", "Just over five hours", "More than six hours"], 2, "Terminó en algo menos de cinco horas (just under five hours).")
        ]
      },
      {
        title: "Thirty-five years at the school (speech)",
        transcript: "Good evening, everyone. Before we raise our glasses, I'd like to say a few words about Mr Alvarez, who has taught at this school for thirty-five years. He arrived in 1989 as a young teacher with one suitcase and a lot of enthusiasm. He has taught more than four thousand students, and I'm sure many of you in this room were one of them. He has also been the coach of the football team since 1995. Last week, he told me that he's going to spend his retirement growing vegetables and learning to play the piano. So, Mr Alvarez, thank you for everything you've done. We'll miss you, and we hope you'll visit us often. To Mr Alvarez!",
        questions: [
          q("What is the occasion?", "A retirement party", ["A wedding", "A school graduation", "A birthday party"], 3, "El hablante habla de la carrera del señor Alvarez y de su jubilación."),
          q("How long has Mr Alvarez worked at the school?", "Thirty-five years", ["Twenty-five years", "Forty years", "Fifteen years"], 0, "El hablante dice que ha dado clase en el colegio durante treinta y cinco años."),
          q("What has Mr Alvarez done since 1995?", "Coached the football team", ["Taught music", "Been the head teacher", "Written school books"], 2, "Es el entrenador del equipo de fútbol desde 1995."),
          q("What is he going to do in his retirement?", "Grow vegetables and learn the piano", ["Travel around the world", "Coach another team", "Write a book"], 1, "Va a cultivar verduras y aprender a tocar el piano."),
          q("What does the speaker hope?", "That he will visit the school often", ["That he will come back to teach", "That students will write to him", "That he will give a speech"], 3, "El hablante dice: we hope you'll visit us often (esperamos que nos visite a menudo).")
        ]
      }
    ]
  },

  {
    id: "b1-u01-writing",
    title: "Writing: five tasks about experiences and life events",
    skill: "Writing",
    type: "writing",
    duration: 60,
    intro: "Complete five writing tasks of different types: an informal email, a narrative, an article, a formal email and an opinion text. Write your answer, save it, and then compare it with the model answer and the assessment rubric. These tasks are not marked automatically.",
    rubric: writingRubricB1,
    tasks: [
      {
        title: "Informal email",
        prompt: "Write an email to an English-speaking friend. Tell them about a trip or a new experience you have had recently. Say what you enjoyed, what was difficult, and invite them to do something with you soon.",
        wordCount: "120–150 words",
        tips: [
          "Start with Hi / Dear + name and finish with Best wishes / Love.",
          "Use the past simple for the story and the present perfect for recent news.",
          "Use a friendly tone: contractions and informal expressions are fine."
        ],
        modelAnswer: "Hi Chloe,\n\nHow are you? Sorry I haven't written for a while – I've been really busy!\n\nLast month I did something completely new: I went on a three-day hiking trip in the Pyrenees with my cousin. I had never done anything like it before, so I was quite nervous at first. The views were incredible, and I really enjoyed sleeping in a small mountain hut. The hardest part was the second day, when it rained for hours and my boots got soaked!\n\nDespite that, it was one of the best experiences of my life, and I've already started planning another trip. Would you like to come with us next spring? I'm sure you'd love it.\n\nLet me know what you think!\n\nBest wishes,\nAna"
      },
      {
        title: "Narrative",
        prompt: "Write a short story that begins: 'It was a day I will never forget.' Use past tenses and linking words (when, while, then, after that, finally).",
        wordCount: "120–150 words",
        tips: [
          "Set the scene first: where, when and who.",
          "Use past simple for the main events and past continuous for the background.",
          "Finish with a clear ending or a reflection."
        ],
        modelAnswer: "It was a day I will never forget. I was nine years old, and my family had just moved to a small town by the sea. That morning, I woke up early and decided to explore the beach on my own.\n\nWhile I was walking along the rocks, I heard a strange noise. I looked down and saw a tiny kitten stuck between two stones. It was crying and shaking with cold. I carefully lifted it out and carried it home inside my jumper.\n\nMy parents were surprised, but when they saw how happy I was, they agreed to keep it. We named the kitten Rocky. He lived with us for sixteen years, and every time I walk on that beach, I remember the morning that changed my childhood."
      },
      {
        title: "Article",
        prompt: "Write an article for your school magazine called 'My proudest achievement'. Describe what you did, the difficulties you had, and why it was important to you.",
        wordCount: "120–150 words",
        tips: [
          "Give your article a title and an interesting first sentence.",
          "Use the present perfect for results that matter now.",
          "Address the reader directly at the end (my advice is…)."
        ],
        modelAnswer: "My Proudest Achievement\n\nMost people think proud moments are about winning prizes, but mine is about learning to play the piano as an adult.\n\nThree years ago, I bought a second-hand piano because I had always wanted to play. At the beginning, I could barely read music, and my fingers seemed to have a mind of their own. I practised for twenty minutes every evening, even when I felt tired or discouraged. Last December, I played a short piece at my family's Christmas dinner without making a single mistake.\n\nI have never felt so proud. It wasn't only about the music: I learnt that small, regular effort can lead to big results. If you have a dream, my advice is simple: start today and be patient with yourself."
      },
      {
        title: "Formal email",
        prompt: "You see an advertisement for a summer job at a language school. Write a formal email to the director. Say why you are interested, describe your relevant experience, and ask two questions.",
        wordCount: "120–150 words",
        tips: [
          "Use Dear Ms/Mr + surname and finish with Yours sincerely (or Yours faithfully if you do not know the name).",
          "Do not use contractions and avoid slang.",
          "Use set phrases: I am writing to…, I would be grateful if…, I look forward to hearing from you."
        ],
        modelAnswer: "Subject: Application for summer position\n\nDear Ms Taylor,\n\nI am writing to apply for the summer assistant position advertised on your website. I am interested in this job because I enjoy working with young people and I would like to improve my teaching skills.\n\nI have just finished my first year of a degree in Education. Last summer, I worked as a volunteer in a children's camp, where I organised games and helped with English activities. I am responsible, patient and good at working in a team.\n\nI would be grateful if you could tell me what the working hours are and whether accommodation is provided.\n\nI have attached my CV and I look forward to hearing from you.\n\nYours sincerely,\nMarta López"
      },
      {
        title: "Opinion text",
        prompt: "Some people say that young people should travel before they start working. Do you agree? Write a text giving your opinion and at least two reasons.",
        wordCount: "120–150 words",
        tips: [
          "State your opinion clearly in the first paragraph.",
          "Organise your reasons with Firstly, Secondly, However, To sum up.",
          "Give an example or a reason for each idea."
        ],
        modelAnswer: "In my opinion, young people should spend some time travelling before they start working, although it is not always possible.\n\nFirstly, travelling teaches you to be independent. When you are in a foreign country, you have to solve problems on your own, and this makes you more confident. Secondly, it is a great way to learn about other cultures and to practise languages, which are useful skills for many jobs.\n\nHowever, I understand that travelling is expensive. For this reason, I think young people could take a short trip or work abroad for a few months instead of taking a long holiday.\n\nTo sum up, I believe that the experience you gain while travelling is as valuable as many courses, so it is worth the effort."
      }
    ]
  },

  {
    id: "b1-u01-speaking",
    title: "Speaking: five situations about experiences and life events",
    skill: "Speaking",
    type: "speaking",
    duration: 40,
    intro: "Practise five speaking situations: describing a scene, answering questions, a role play, giving an opinion and making a decision. Prepare your notes, speak out loud (you can record yourself with your phone), and then compare with the model answer and the criteria. The application does not mark speaking automatically.",
    criteria: speakingCriteriaB1,
    situations: [
      {
        title: "Describe a situation",
        prompt: "Imagine a photo of a group of friends in graduation gowns throwing their hats into the air in front of a university building. Describe the scene: who the people are, what they are doing and how they might be feeling. Speak for about one minute.",
        usefulPhrases: [
          "In the picture I can see…",
          "In the foreground / in the background…",
          "They look / seem + adjective",
          "It might be… / It could be…",
          "I'd say they feel…",
          "They have probably just…"
        ],
        modelAnswer: "In the picture I can see a group of about six friends wearing black gowns and hats. They are standing in front of a big old building, probably a university. In the foreground, they are throwing their hats into the air and laughing. They look extremely happy and proud. I'd say they have just finished their degrees, so this is probably the graduation ceremony. In the background, there are some parents taking photos. I think it is a very special day for them because they have worked hard for years, and now they are ready to start a new stage in their lives."
      },
      {
        title: "Answer personal questions",
        prompt: "Answer these questions as if you were talking to an examiner: 1) Have you ever lived or studied abroad? 2) What is the most exciting thing you have done this year? 3) When did you last try something new? 4) Is there something you have never done but would like to do?",
        usefulPhrases: [
          "Yes, I have. I … in …",
          "No, I haven't, but I'd love to…",
          "The most exciting thing I've done is…",
          "The last time was when…",
          "It was a bit scary, but…",
          "I've always wanted to…"
        ],
        modelAnswer: "Yes, I have. I spent six months in Dublin when I was nineteen, and I studied English there. The most exciting thing I've done this year is a skydive, which I did for my birthday. The last time I tried something new was last weekend, when I went climbing for the first time. It was a bit scary, but I loved it. And something I've never done but would like to do is visit Japan. I've always been interested in its culture and food."
      },
      {
        title: "Role play: after the holiday",
        prompt: "Role play. You have just come back from a holiday and a friend asks you about it. Answer the questions, give details about your trip and ask your friend about their summer. Practise both parts.",
        usefulPhrases: [
          "How was your trip? – It was fantastic!",
          "We visited… / We ate… / We took…",
          "Did you have any problems? – Only one…",
          "Have you ever been there? – No, it was my first time.",
          "What about you? Have you had a holiday yet?",
          "Lucky you! / That sounds great!"
        ],
        modelAnswer: "Friend: Hi! Welcome back. How was your trip?\nYou: It was fantastic! I went to Lisbon with my sister.\nFriend: Lucky you! What did you do there?\nYou: We visited the old town, ate lots of fresh fish and took a tram up to the castle.\nFriend: Did you have any problems?\nYou: Only one. We missed the train to Sintra, but we took a bus instead.\nFriend: Had you been there before?\nYou: No, it was my first time. What about you? Have you had a holiday yet?\nFriend: Not yet, but I'm going to Greece in August."
      },
      {
        title: "Give and justify an opinion",
        prompt: "Talk for one to two minutes: What is the best age to leave your parents' home? Give your opinion and explain your reasons with examples.",
        usefulPhrases: [
          "In my opinion…",
          "The way I see it…",
          "One reason is that…",
          "On the other hand…",
          "For example…",
          "That's why I think…"
        ],
        modelAnswer: "In my opinion, the best age to leave home is between twenty-two and twenty-five. One reason is that by then most people have finished their studies and can find a job. On the other hand, if you leave too early, you may not have enough money, and living alone can be very expensive. For example, my cousin moved out at eighteen, but she had to come back after six months because she couldn't pay the rent. That's why I think it's better to wait until you feel financially ready and know how to manage your own life."
      },
      {
        title: "Discuss and decide together",
        prompt: "Your best friend has just graduated. You and your partner must choose one gift from these three options: a weekend trip, a good watch, a cooking course. Discuss the advantages and disadvantages of each option and decide together which gift is best.",
        usefulPhrases: [
          "How about…? / What about…?",
          "What do you think of…?",
          "I'm not sure that…",
          "I agree, but… / That's true, but…",
          "Let's go for…",
          "In the end, I think we should…"
        ],
        modelAnswer: "A: Shall we start with the weekend trip?\nB: It's a nice idea, but it could be expensive, and she has just finished her exams.\nA: True. What about the watch?\nB: I'm not sure she'd wear it. She hates jewellery.\nA: Then what do you think of the cooking course? She has always wanted to learn Italian dishes.\nB: That's a great idea, and we could go with her to the first lesson!\nA: Agreed. Let's go for the cooking course.\nB: Perfect. I'll look for one near her house."
      }
    ]
  }
];
