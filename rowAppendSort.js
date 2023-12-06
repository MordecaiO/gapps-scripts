function sortRows() {

  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName("Sheet1")
  const range = sheet.getDataRange()
  /* We need to establish the dimensions of our data
     - each nested array is one row of data 
     - each value in the nested array is a cell in that row
  */
  const numRows = sheet.getDataRange().getValues().length
  const numCols = sheet.getDataRange().getValues()[0].length
  
  // defining a new range starting from the second row and first col
  const noHeaderRange = sheet.getRange(2, 1, numRows - 1, numCols)
  const noHeaderData = noHeaderRange.getValues()


  let noHeaderDataCopy = [...noHeaderData]
  // before sort
  Logger.log(noHeaderDataCopy)
  // sort in alphabetical order
  noHeaderDataCopy.sort((a, b) => {
    return a[4].localeCompare(b[4])
  })
  // after sort
  Logger.log(noHeaderDataCopy)

  
  let sum = 0;
  let newRowIdx = [];
  let sumArr = []
  let rowsInserted = 0;
  // loop through arr rows 

  for (let i = 0; i < noHeaderDataCopy.length; i++) {
    // declare var for value we will be summing and displaying 
    let testVal = noHeaderDataCopy[i][2]
    let targetVal = noHeaderDataCopy[i][3];
    let sortVal = noHeaderDataCopy[i][4];
    // next val - if next value doesn't exist empty string 
    let nextSortVal = noHeaderDataCopy[i + 1] ? noHeaderDataCopy[i + 1][4] : ""
    if(testVal) sum += targetVal;
    // when what we are sorting by is about to change 
    // we have to adjust the indexes we store to insert at by how many rows have already been inserted
    if (sortVal !== nextSortVal) {
      newRowIdx.push(i + 1 + rowsInserted);
      sumArr.push(sum);
      sum = 0;
      rowsInserted++
    }
  }
  
  // insert this new arr (row)
  for (let i = 0; i < newRowIdx.length; i++) {
    // ensure the arr (row) is same length as others 
    let newRow = new Array(noHeaderDataCopy[0].length)
    // populate arr with the cumulative sum of our target value 
    newRow[3] = sumArr[i];
    // add arr
    noHeaderDataCopy.splice(newRowIdx[i], 0, newRow)
  }

  Logger.log(noHeaderDataCopy);
  // populate data cells with data
  const newDataRange = sheet.getRange(2, 1, numRows + rowsInserted -1, numCols)
  newDataRange.setValues(noHeaderDataCopy)
}
