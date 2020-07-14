import algoliasearch from 'algoliasearch/lite';

const SEARCH_CLIENT = algoliasearch(
  'E82P8D3AVW',
  '18f48284be85f748f3201280dc0938ce'
);

const DEV_INDEX = 'dev_ADS';
const PROD_INDEX = 'prod_ADS';

export { SEARCH_CLIENT, DEV_INDEX, PROD_INDEX };
