// item will be ['date', [6 winner number], additional number], e.g: ['2023-01-20', [1,2,3,4,5,6], 7]
const data = [];

document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json').then((res) => res.json()).then((responseData) => {
    data.push(...responseData);
    document.getElementById('loading').textContent = 'Data loaded!';
    console.log(data);
  });

  restoreStartDateAndEndDate();
  document.getElementById('generate-btn').addEventListener('click', generate);
});

function generate() {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;

  window.localStorage.setItem('generate_number_start_date', startDate);
  window.localStorage.setItem('generate_number_end_date', endDate);

  const firstValue = getSelectedValue('first-numb');
  const secondValue = getSelectedValue('second-numb');
  const thirdValue = getSelectedValue('third-numb');
  const fourthValue = getSelectedValue('forth-numb');
  const fifthValue = getSelectedValue('fifth-numb');
  const sixthValue = getSelectedValue('sixth-numb');

  const items = getItemsInRange(startDate, endDate);

  // Top 10 number
  const topNumbersObj = {};
  items.forEach((item) => {
    const [dateString, numbers, _] = item;
    numbers.forEach((numb) => {
      if (topNumbersObj[numb]) {
        topNumbersObj[numb] = topNumbersObj[numb] + 1;
      } else {
        topNumbersObj[numb] = 1;
      }
    });
  });


  const topNumbers = Object.entries(topNumbersObj);
  topNumbers.sort(([, valueA], [, valueB]) => valueB - valueA);


  setupTopTable(topNumbers);
  setupBottomTable(topNumbers);
  setUpNumberNotShow(topNumbers);

  if (topNumbers.length < 6) {
    alert('Not enough number to auto generate');
    return;
  }

  const firstNumb = generateNumber(topNumbers, firstValue, []);
  const secondNumb = generateNumber(topNumbers, secondValue, [firstNumb]);
  const thirdNumb = generateNumber(topNumbers, thirdValue, [firstNumb, secondNumb]);
  const fourthNumb = generateNumber(topNumbers, fourthValue, [firstNumb, secondNumb, thirdNumb]);
  const fifthNumb = generateNumber(topNumbers, fifthValue, [firstNumb, secondNumb, thirdNumb, fourthNumb]);
  const sixthNumb = generateNumber(topNumbers, sixthValue, [firstNumb, secondNumb, thirdNumb, fourthNumb, fifthNumb]);

  document.getElementById('generate-number-text').textContent = `Generate number: ${firstNumb} ${secondNumb} ${thirdNumb} ${fourthNumb} ${fifthNumb} ${sixthNumb} `;
}

function setupTopTable(topNumbers) {
  // Duplicate table winning
  const table = document.getElementById('top-10-table');
  deleteRows(table.querySelectorAll('.row'));
  topNumbers.map((item) => [item[0], item[1]]).forEach((row) => insertRow(table, row));
}

function setupBottomTable(topNumbers) {
  // Duplicate table winning
  const table = document.getElementById('bottom-10-table');
  deleteRows(table.querySelectorAll('.row'));
  for (let i = topNumbers.length - 1; i >= 0; i--) {
    insertRow(table, topNumbers[i]);
  }
}

function setUpNumberNotShow(topNumbers) {
  // Duplicate table winning
  const table = document.getElementById('havent-show-table');
  deleteRows(table.querySelectorAll('.row'));

  for (let i = 1; i <= 49; i++) {
    const founded = topNumbers.some((item) => Number(item[0]) === i);
    if (!founded) {
      insertRow(table, [i]);
    }
  }
}

function restoreStartDateAndEndDate() {
  const savedStartDate = window.localStorage.getItem('generate_number_start_date');
  const savedEndDate = window.localStorage.getItem('generate_number_end_date');

  // if (savedEndDate) {
  //   document.getElementById('end-date').value = savedEndDate;
  // } else {
    // Get today's date
    const today = new Date();

    // Format the date as "YYYY-MM-DD" for the input element
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Set the default value of the input element to today's date
    document.getElementById('end-date').value = formattedDate;
  // }

  if (savedStartDate) {
    document.getElementById('start-date').value = savedStartDate;
  }
}

/**
 * 
 * @param {string} inputName 
 * @returns string
 */
function getSelectedValue(inputName) {
  // Select the default selected radio button
  const defaultSelectedRadioButton = document.querySelector(`input[name="${inputName}"]:checked`);

  // Get the value of the default selected radio button
  if (defaultSelectedRadioButton) {
    const defaultValue = defaultSelectedRadioButton.value;
    return defaultValue;
  }

  return '';
}

function getItemsInRange(startDate, endDate) {
  return data.filter((item) => {
    const date = item[0];
    const startDateCondition = isDate1EqualDate2(date, startDate) || isDate1GreaterThanDate2(date, startDate);
    const endDateCondition = isDate1EqualDate2(date, endDate) || isDate1GreaterThanDate2(endDate, date);
    return startDateCondition && endDateCondition;
  });
}

/**
 * @param {*} topNumbers 
 * @param {*} type 
 * @param {*} existNumbers 
 * @returns number
 */
function generateNumber(topNumbers, type, existNumbers) {
  const botNumbers = [...topNumbers].reverse().slice(0, 10);
  const topNumbersWithSlice = topNumbers.slice(0, 10);

  while (true) {
    let value;
    if (type === 'top') {
      value = getRandomItem(topNumbersWithSlice)[0];
    } else {
      value = getRandomItem(botNumbers)[0];
    }

    if (!existNumbers.includes(value)) {
      return value;
    }
  }
}

/**
 * 
 * @param {Array} array 
 * @returns 
 */
function getRandomItem(array) {
  // Generate a random index
  const randomIndex = Math.floor(Math.random() * array.length);

  // Return the element at the random index
  return array[randomIndex];
}
