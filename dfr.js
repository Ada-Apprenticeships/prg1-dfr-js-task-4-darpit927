// Import the 'fs' module to work with the file system
const fs = require('fs'); 

// This function checks if a given file exists in the file system and returns a boolean value
function fileExists(filename) {
  return fs.existsSync(filename);
}

// This function checks if the given argument is a valid number (integer or float, positive or negative)
function validNumber(num) {
  const pattern = /^-?\d+(\.\d+)?$/;
  if (typeof num === 'number') {
    return true;
  }
  if (typeof num === 'string') {
    return pattern.test(num);
  }
  return false;
}

// This function returns the dimensions of a dataframe or dataset as [rows, columns]
function dataDimensions(data) {
  if (data === undefined || data === null) {
    return [-1, -1];
  } else if (Array.isArray(data)) {
    if (data.length === 0) {
      return [0, -1];
    } else if (data.every(Array.isArray)) {
      let rows = data.length;
      let cols = data[0].length > 0 ? data[0].length : -1;
      return [rows, cols];
    } else {
      return [data.length, -1];
    }
  } else {
    return [-1, -1];
  }
}

// This function calculates the mean (average) of all valid number values in the given dataset
function calculateMean(dataset) {
  if (!Array.isArray(dataset) || dataset.length === 0) {
    return false;
  }

  const validNums = dataset.filter(validNumber).map(Number);
  if (validNums.length === 0) {
    return false;
  }

  const sum = validNums.reduce((acc, val) => acc + val, 0);
  return sum / validNums.length;
}

// This function calculates the total sum of all valid number values in the given dataset
function findTotal(dataset) {
  if (!Array.isArray(dataset) || dataset.length === 0) {
    return false;
  }

  const validNums = dataset.filter(validNumber).map(Number);
  if (validNums.length === 0) {
    return false;
  }

  return validNums.reduce((acc, val) => acc + val, 0);
}

// This function converts valid number values in the specified column of the dataframe to float
function convertToFloat(df, colIndex) {
  if (!Array.isArray(df) || df.length === 0) {
    return 0;
  }

  let count = 0;
  for (let row of df) {
    if (
      colIndex < row.length &&
      typeof row[colIndex] !== 'number' &&
      validNumber(row[colIndex])
    ) {
      row[colIndex] = parseFloat(row[colIndex]);
      count++;
    }
  }
  return count;
}

// This function flattens a dataframe with shape [n, 1] into a dataset (1D array)
function flatten(df) {
  if (!Array.isArray(df) || df.length === 0 || dataDimensions(df)[1] !== 1) {
    return [];
  }

  return df.map(row => row[0]);
}

// This function loads a CSV file and returns the data along with its dimensions, excluding ignored rows and columns
function loadCSV(filename, ignoreRows = [], ignoreCols = []) {
  if (!fs.existsSync(filename)) {
    return [[], -1, -1];
  }

  const data = fs.readFileSync(filename, 'utf-8')
    .split('\n')
    .filter(line => line.trim().length > 0) // Remove empty lines
    .map(line => line.split(','));

  let originalRows = data.length;
  let originalCols = originalRows > 0 ? data[0].length : 0;

  // Refine row filtering based on your specific requirements
  const filteredData = data.filter((_, rowIndex) => !ignoreRows.includes(rowIndex));

  const rows = filteredData.length+1;
  const cols = rows > 0 ? filteredData[0].length : 0;

  return [filteredData, rows, cols];
}

// This function calculates the median value of all valid number values in the given dataset
function calculateMedian(dataset) {
  const validNums = dataset.filter(validNumber).map(Number);
  if (validNums.length === 0) {
    return false;
  }

  validNums.sort((a, b) => a - b);
  const mid = Math.floor(validNums.length / 2);

  if (validNums.length % 2 === 0) {
    return (validNums[mid - 1] + validNums[mid]) / 2;
  } else {
    return validNums[mid];
  }
}

// This function creates a slice of the dataframe based on a specified column value and optional columns to export
function createSlice(df, colIndex, colPattern, exportCols = []) {
  if (!Array.isArray(df) || df.length === 0) {
    return [];
  }

  let rowsToInclude;
  if (colPattern === '*') {
    rowsToInclude = df;
  } else {
    rowsToInclude = df.filter(row => row[colIndex] === colPattern);
  }

  if (exportCols.length === 0) {
    return rowsToInclude;
  }

  return rowsToInclude.map(row => exportCols.map(i => row[i]));
}

// loadCSV('/workspaces/prg1-dfr-js-task-4-darpit927/datatrafficdataset_2000.csv',[1,2,3],[1,2,3]);


module.exports = {
  fileExists, validNumber, dataDimensions, calculateMean, findTotal, convertToFloat, flatten, 
  loadCSV, calculateMedian, createSlice,
} 
