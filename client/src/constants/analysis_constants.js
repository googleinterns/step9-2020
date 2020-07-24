const HEADLINE_PLACEHOLDER =
  'e.g. Fighting Climate Change | Pete Buttigieg 2020 | Learn More';
const CONTENT_PLACEHOLDER =
  "e.g. Climate change is a life and death issue for our generation. It's time for bold action.";

const INPUT_LIST = [
  { label: 'headline', placeholder: HEADLINE_PLACEHOLDER },
  { label: 'content', placeholder: CONTENT_PLACEHOLDER },
];

const INPUT_ROWS = 3;

const LIGHT_RED = '#ffbbc6';
const LIGHT_GRAY = '#e8e8e8';
const LIGHT_GREEN = '#a8ffcc';

const COLOR_MAP = {
  negative: { label: 'Negative', color: 'red', background: LIGHT_RED },
  neutral: { label: 'Neutral', color: 'gray', background: LIGHT_GRAY },
  positive: { label: 'Positive', color: 'green', background: LIGHT_GREEN },
};

const DEFAULT_VALUE = {
  entities: [],
  sentiment: { score: 0.0, magnitude: 0.0 },
};

const DEFAULT_ANALYSIS = {
  headlineAnalysis: DEFAULT_VALUE,
  contentAnalysis: DEFAULT_VALUE,
};

export { COLOR_MAP, DEFAULT_ANALYSIS, INPUT_LIST, INPUT_ROWS };
