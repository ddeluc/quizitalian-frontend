export const BACKEND_URL = 'https://quizitalian-backend-3onsy6bzlq-uc.a.run.app';
// export const BACKEND_URL = 'http://localhost:5000/';

export const quizSetup = {
  prepositions: {
    title: 'Prepositions',
    ref: [
      'a', 'al', 'allo', 'alla', "all'", 'ai', 'agli', 'alle',
      'di', 'del', 'dello', 'della', "dell'", 'dei', 'degli', 'delle',
      'da', 'dal', 'dallo', 'dalla', "dall'", 'dai', 'dagli', 'dalle',
      'in', 'nel', 'nello', 'nella', "nell'", 'nei', 'negli', 'nelle',
      'su', 'sul', 'sullo', 'sulla', "sull'", 'sui', 'sugli', 'sulle',
      'con', 'per', 'tra', 'fra'
    ],
    description: `Prepositions are words indicating the 
    relationship between nouns, pronouns and other words in a sentence. 
    They indicate direction, location, time and manner, 
    such as "in", "a", "da", "di", etc.`
  },
  indefiniteArticles: {
    title: 'Indefinite Articles', 
    ref: [
     'un', 'uno', 'una', "un'"
    ],
    description: `Indefinite articles are words that indicate 
    that a noun refers to any one of a group of things, rather 
    than a specific thing. In Italian, "un" and "una" are indefinite 
    articles used before a noun to indicate generality and gender 
    depending on the word that follows it.`
  },
  verbs: {
    title: 'Verbs',
    ref: null,
    description: `Verb description`
  }
};

export const partsOfSpeech = [
  {
    pos: ['E'],
    context: {
      title: 'Prepositions',
      plural: 'prepositions', 
      singular: 'preposition'
    },
    colors: {
      bg: {
        100: 'bg-sunglow-100',
        200: 'bg-sunglow-200',
        300: 'bg-sunglow-300',
        hover: 'hover:bg-sunglow-300',
        disabled: 'disabled:bg-sunglow-100',
      },
      border: {
        200: 'border-sunglow-200',
        300: 'border-sunglow-300',
        focus: 'focus:border-sunglow-300'
      }
    },
  },
  {
    pos: ['V', 'VA'],
    context: {
      title: 'Verbs',
      plural: 'verbs', 
      singular: 'verb'
    },
    colors: {
      bg: {
        100: 'bg-skyblue-100',
        200: 'bg-skyblue-200',
        300: 'bg-skyblue-300',
        hover: 'hover:bg-skyblue-300',
        disabled: 'disabled:bg-skyblue-100',
      },
      border: {
        200: 'border-skyblue-200',
        300: 'border-skyblue-300',
        focus: 'focus:border-skyblue-300'
      }
    },
  },
  {
    pos: ['S'],
    context: {
      title: 'Nouns',
      plural: 'nouns', 
      singular: 'noun'
    },
    colors: {
      bg: {
        100: 'bg-bittersweet-100',
        200: 'bg-bittersweet-200',
        300: 'bg-bittersweet-300',
        hover: 'hover:bg-bittersweet-300',
        disabled: 'disabled:bg-bittersweet-100',
      },
      border: {
        200: 'border-bittersweet-200',
        300: 'border-bittersweet-300',
        focus: 'focus:border-bittersweet-300',
      }
    },
  },
  {
    pos: ['A', 'AP'],
    context: {
      title: 'Adjectives',
      plural: 'adjectives', 
      singular: 'adjective'
    },
    colors: {
      bg: {
        100: 'bg-tropicalindigo-100',
        200: 'bg-tropicalindigo-200',
        300: 'bg-tropicalindigo-300',
        hover: 'hover:bg-tropicalindigo-300',
        disabled: 'disabled:bg-tropicalindigo-100',
      },
      border: {
        200: 'border-tropicalindigo-200',
        300: 'border-tropicalindigo-300',
        focus: 'focus:border-tropicalindigo-300'
      }
    },
  },
];
