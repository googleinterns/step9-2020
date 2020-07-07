const generateRandomHexColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// eslint-disable-next-line no-eval
const convertStringToObject = str => eval(`(${str})`);

const getDatesBetween = function(startDate, endDate) {
  const dates = [];
  let currentDate = startDate;
  const addDays = function(days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};

const getAverage = valueList => {
  const total = valueList.reduce((a, b) => a + b, 0);
  return total / valueList.length;
};

export {
  generateRandomHexColor,
  convertStringToObject,
  getDatesBetween,
  getAverage,
};
