const DEV_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
const PROD_KEY = '6Lf6V7QZAAAAAKU5Pkol0KkOELbo8H_rdNiAa1Xq';

const CLIENT_KEY = process.env.NODE_ENV === 'development' ? DEV_KEY : PROD_KEY;

export { CLIENT_KEY };
