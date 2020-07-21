const HEADLINE_PLACEHOLDER =
  'e.g. Fighting Climate Change | Pete Buttigieg 2020 | Learn More';
const CONTENT_PLACEHOLDER =
  "e.g. Climate change is a life and death issue for our generation. It's time for bold action.";

const INPUT_LIST = [
  { label: 'HEADER', placeholder: HEADLINE_PLACEHOLDER },
  { label: 'CONTENT', placeholder: CONTENT_PLACEHOLDER },
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

const mockContentTerms = [
  '{"name": "Donald Trump", "type": "PERSON", "salience": 0.61}',
  '{"name": "Georgia", "type": "LOCATION", "salience": 0.2}',
  '{"name": "re-election", "type": "EVENT", "salience": 0.1}',
  '{"name": "help", "type": "OTHER", "salience": 0.08}',
  '{"name": "Chip", "type": "PERSON", "salience": 0.01}',
  '{"name": "2020", "type": "DATE", "salience": 0.0}',
  '{"name": "$5", "type": "PRICE", "salience": 0.0}',
  '{"name": "2020", "type": "NUMBER", "salience": 0.0}',
  '{"name": "5", "type": "NUMBER", "salience": 0.0}',
];

const mockHeaderTerms = [
  '{"name": "Georgia", "type": "LOCATION", "salience": 0.9}',
  '{"name": "Make America Great Again", "type": "OTHER", "salience": 0.1}',
  '{"name": "2020", "type": "DATE", "salience": 0.0}',
  '{"name": "2020", "type": "NUMBER", "salience": 0.0}',
];

const mockHeaderScore = 0.4;
const mockHeaderMagnitude = 0.7;

const mockContentScore = -0.1;
const mockContentMagnitude = 0.2;

const MOCK_DATA = {
  mockContentTerms,
  mockHeaderTerms,
  mockHeaderScore,
  mockHeaderMagnitude,
  mockContentScore,
  mockContentMagnitude,
};

export { COLOR_MAP, INPUT_LIST, INPUT_ROWS, MOCK_DATA };
