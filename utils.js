/**
 * Must follow '2,27,29,36,44,48' format
 * @param {string} numberString 
 * @returns boolean
 */
function isValidSixNumberList(numberString) {
  // Regular expression to match exactly six numbers separated by commas
  const regex = /^(\d+\s){5}\d+$/;

  // Test the string against the regular expression
  return regex.test(numberString);
}

/**
 * 
 * @param {Array} arr1 
 * @param {Array} arr2 
 * @returns boolean
 */
function arraysContainSameElements(arr1, arr2) {
  // Sort the arrays
  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();

  // Check if the sorted arrays are equal
  if (sortedArr1.length !== sortedArr2.length) {
    return false; // If the lengths are different, they can't be equal
  }

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false; // If any elements are different, they are not equal
    }
  }

  return true; // If all elements are the same, the arrays are equal
}

/**
 * 
 * @param {HTMLTableElement} tableElement 
 * @param {Array} data 
 */
function insertRow(tableElement, data) {
  // Create a new row
  const newRow = document.createElement('tr');
  newRow.className = 'row';

  data.forEach((item) => {
    const cell = document.createElement('td');
    cell.textContent = item;
    newRow.appendChild(cell);
  });

  tableElement.appendChild(newRow);
}

/**
 * 
 * @param {NodeListOf<Element>} elements 
 */
function deleteRows(elements) {
  elements.forEach(row => {
    row.parentNode.removeChild(row);
  });
}