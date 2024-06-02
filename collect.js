const fs = require("fs");
const { JSDOM } = require("jsdom");

// item will be ['date', [6 winner number], additional number], e.g: ['2023-01-20', [1,2,3,4,5,6], 7]
const data = [];
// For getLatestDate if data.json don't have any data
const beforeFirstToToDate = '2008-07-03';

async function start() {
  await getSavedData();
  log('----------------------------');
  const latestDateString = getLatestDate();
  log('----------------------------');
  await getLottoLyzerData(latestDateString);
  log('----------------------------');
  writeDataToFile();
}

async function getSavedData() {
  log('Get saved data...');
  const savedData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
  savedData.forEach((item) => {
    if (item.length !== 3) {
      log(`Item length !== 3:`, 'error');
      log(item);
      return;
    }

    const [dateString, numbers, additionalNumber] = item;
    if (typeof dateString !== "string" || numbers.length !== 6 || typeof additionalNumber !== 'number') {
      log(`Item not follow format:`, 'error');
      log(item);
      return;
    }
    data.push(item);
  });
  log('Get saved data complete!');
}

/**
 * @returns string
 */
function getLatestDate() {
  let latestDateString = beforeFirstToToDate;
  data.forEach((item) => {
    const currentDateString = item[0];

    const currentDate = new Date(currentDateString);
    const latestDate = new Date(latestDateString);

    if (isDate1GreaterThanDate2(currentDate, latestDate)) {      
      latestDateString = currentDateString;
    }
  });

  return latestDateString;
}

/**
 * 
 * @param {string} latestDateString 
 */
async function getLottoLyzerData(latestDateString) {
  let pageNumber = 1;
  let isBreakLoop = false;

  while (true) {
    log(`getLottoLyzerData page ${pageNumber}...`);
    const response = await fetch(`https://en.lottolyzer.com/history/singapore/toto/page/${pageNumber}/per-page/50/summary-view`).then((res) => res.text());
    const dom = new JSDOM(response);
    const tableElem = dom.window.document.getElementById('summary-table');
    const tBodyElem = tableElem.querySelector('tbody');
    const trElms = tBodyElem.querySelectorAll('tr');
    trElms.forEach((elm) => {
      const tdElms = elm.querySelectorAll('td');
      // No more data to get
      if (tdElms.length < 4) {
        isBreakLoop = true;
        return;
      }

      const dateString = tdElms.item(1).textContent.trim();
      const numbersString = tdElms.item(2).textContent.trim();
      const additionalNumbString = tdElms.item(3).textContent.trim();

      if (!isValidDateString(dateString)) {
        log(`dateString not valid: '${dateString}'`, 'error');
        return;
      }

      if (!isValidSixNumberList(numbersString)) {
        log(`numbersString not valid: '${numbersString}'`, 'error');
        return;
      }

      if (!isNumber(additionalNumbString)) {
        log(`additionalNumbString not valid: '${additionalNumbString}'`, 'error');
        return;
      }

      // No more data to get
      if (isDate1GreaterThanDate2(latestDateString, dateString) || isDate1EqualDate2(latestDateString, dateString)) {
        isBreakLoop = true;
        return;
      }

      // Add data
      const item = [dateString, numbersString.split(',').map(Number), Number(additionalNumbString)];
      data.push(item);
      log(`Add data for date '${dateString}', number: '${numbersString}', additional number: '${additionalNumbString}'`);
    });

    if (isBreakLoop) {
      log(`No more page to get, current page: ${pageNumber}, latestDate: ${latestDateString}`);
      break;
    }

    // Go to next page
    await delaySecond(1);
    pageNumber++;
    log('-------');
  }

  log(`Complete getLottoLyzerData!`);
}

function writeDataToFile() {
  log(`Writing data to file...`);
  const jsonData = JSON.stringify(data);
  fs.writeFileSync('data.json', jsonData, 'utf8');
  log(`Write data to file complete!`);
}

/**
 * @param {*} msg
 * @param {'info' | 'error'} type
 */
function log(msg, type = "info") {
  const prefix = {
    info: "[INFO]",
    error: "[ERROR]",
  };
  console.log(`${prefix[type]}: ${msg}`);
}

/**
 * @param {string} dateString 
 * @returns boolean
 */
function isValidDateString(dateString) {
  // Regular expression to match YYYY-MM-DD format
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  // Check if the date string matches the regex pattern
  if (!dateString.match(regex)) {
    return false;
  }

  // Parse the date parts to integers
  const parts = dateString.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  // Check the ranges of month and day
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  // Create a date object from the string
  const date = new Date(dateString);

  // Check if the date object represents the same date as the input
  return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
}

/**
 * Must follow '2,27,29,36,44,48' format
 * @param {string} numberString 
 * @returns boolean
 */
function isValidSixNumberList(numberString) {
  // Regular expression to match exactly six numbers separated by commas
  const regex = /^\d+(,\d+){5}$/;

  // Test the string against the regular expression
  return regex.test(numberString);
}

/**
 * @param {string} str 
 * @returns boolean
 */
function isNumber(str) {
  return !isNaN(Number(str));
}

/**
 * 
 * @param {string} dateString1 
 * @param {string} dateString2 
 * @returns 
 */
function isDate1GreaterThanDate2(dateString1, dateString2) {
  // Convert date strings to Date objects
  let date1 = new Date(dateString1);
  let date2 = new Date(dateString2);

  // Compare the dates
  return date1 > date2;
}

function isDate1EqualDate2(dateString1, dateString2) {
  // Convert date strings to Date objects
  let date1 = new Date(dateString1);
  let date2 = new Date(dateString2);

  // Compare the dates
  return date1.getTime() === date2.getTime();
}

/**
 * 
 * @param {number} second 
 */
async function delaySecond(second) {
  await new Promise(resolve => setTimeout(resolve, second * 1000));
  console.log("Delayed function executed after 1 second");
}

start();
