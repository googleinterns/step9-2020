import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  'E82P8D3AVW',
  '18f48284be85f748f3201280dc0938ce'
);

const DEV_INDEX = 'dev_ADS';
const PROD_INDEX = 'prod_ADS';

const algoliaIndex =
  process.env.NODE_ENV === 'development' ? DEV_INDEX : PROD_INDEX;

export { searchClient, algoliaIndex };
