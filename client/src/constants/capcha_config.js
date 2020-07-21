const DEV_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
const PROD_KEY = '6LdY27MZAAAAAOl3M0GEr7b3NeKyU0pRVNpW4UsR';

const CLIENT_KEY = process.env.NODE_ENV === 'development' ? DEV_KEY : PROD_KEY;

export { CLIENT_KEY };
