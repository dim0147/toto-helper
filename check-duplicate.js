// item will be ['date', [6 winner number], additional number], e.g: ['2023-01-20', [1,2,3,4,5,6], 7]
const data = [];

document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json').then((res) => res.json()).then((responseData) => {
    data.push(...responseData);
    document.getElementById('loading').textContent = 'Data loaded!';
    setupWinningSetTable();
    console.log(data);
  });

  document.getElementById('duplicate-btn').addEventListener('click', checkDuplicate);
});

function checkDuplicate() {
  const numbersString = document.getElementById('duplicate-ip').value.trim();
  if (!isValidSixNumberList(numbersString)) {
    alert(`${numbersString} not valid`);
    return;
  }

  const parsedNumbers = numbersString.split(' ').map(Number);

  const duplicatedWinning = data.filter((item) => {
    const itemNumbers = item[1];
    return arraysContainSameElements(itemNumbers, parsedNumbers);
  });

  const duplicatedAdd = data.filter((item) => {
    const additional = item[2];
    return parsedNumbers.some((numb) => numb === additional);
  });

  setupWinningTable(duplicatedWinning);
  setupAdditionalTable(duplicatedAdd);
  setupAdditionalDetailsTable(duplicatedAdd);
}

function setupWinningTable(duplicatedWinning) {
  // Duplicate table winning
  const table = document.getElementById('duplicate-table-winning');
  deleteRows(table.querySelectorAll('.row'));
  if (duplicatedWinning.length === 0) {
    alert('No duplicate winning numbers!');
    return;
  }

  duplicatedWinning.map((item) => [item[0], item[2]]).forEach((row) => insertRow(table, row));

}

function setupAdditionalTable(duplicatedAdd) {
  // Duplicate table winning
  const table = document.getElementById('duplicate-table-additional-number');
  deleteRows(table.querySelectorAll('.row'));
  if (duplicatedAdd.length === 0) {
    alert('No duplicate add numbers!');
    return;
  }

  // property will be number & value will be array of item: { count: number, year: number }
  const result = {};
  duplicatedAdd.forEach((item) => {
    const addNumber = item[2];
    const year = new Date(item[0]).getFullYear();
    if (!result[addNumber]) {
      result[addNumber] = {
        count: 1,
        years: [year],
      }
    } else {
      result[addNumber].count += 1;
      if (!result[addNumber].years.includes(year)) {
        result[addNumber].years.push(year);
      }
    }
  });

  for (const key in result) {
    const number = key;
    const item = result[number];
    insertRow(table, [number, item.years.join(','), item.count])
  }

}

function setupAdditionalDetailsTable(duplicatedAdd) {
  // Duplicate table winning
  const table = document.getElementById('duplicate-table-additional-number-details');
  deleteRows(table.querySelectorAll('.row'));
  if (duplicatedAdd.length === 0) {
    alert('No duplicate add numbers!');
    return;
  }

  // property will be number & value will be array of item: { count: number, year: number }
  const result = {};
  duplicatedAdd.forEach((item) => {
    const addNumber = item[2];
    const year = new Date(item[0]).getFullYear();
    if (!result[addNumber]) {
      result[addNumber] = [{
        count: 1,
        year,
      }]
    } else {
      const numbItems = result[addNumber];
      const foundedItem = numbItems.find((tempItem) => tempItem.year === year);
      if (foundedItem) {
        foundedItem.count += 1;
      } else {
        result[addNumber].push({
          count: 1,
          year,
        });
      }

    }
  });

  for (const key in result) {
    const number = key;
    const items = result[number];
    items.forEach((item) => {
      insertRow(table, [number, item.year, item.count])
    })
  }

}

function setupWinningSetTable() {
  // Duplicate table winning
  const table = document.getElementById('duplicate-table-winning-set');
  deleteRows(table.querySelectorAll('.row'));

  const winningSet = new Map();

  data.forEach((item) => {
    const key = item[1].join(' ');
    const year = getYearFromDate(item[0]);
    if (winningSet.has(key)) {
      const mapItem = winningSet.get(key);
      mapItem.count += 1;
      if (!mapItem.years.includes(year)) {
        mapItem.years.push(year);
      }
      winningSet.set(key, mapItem);
    } else {
      const mapItem = {
        count: 1,
        years: [year]
      };
      winningSet.set(key, mapItem);
    }
  });

  const sortedArray = Array.from(winningSet).filter((item) => {
    return item[1].count > 0;
  });
  sortedArray.sort((a, b) => a[1].count - b[1].count);

  sortedArray.forEach((item) => {
    const [set, { years, count }] = item;
    insertRow(table, [set, years.join(','), count]);
  })
}