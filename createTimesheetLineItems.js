
function UPSTimesheetFormat() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const unformatedSheet = ss.getSheetByName("Timesheet");

  // collect unformatted data
  const timesheet = unformatedSheet.getDataRange()
  let timesheetArr = timesheet.getValues();

  let workerDetails = [];
  let detailProperties = timesheetArr[0];
  let protoObj = {};
  for (const key of detailProperties) {
    protoObj[key] = "";
  }


  // store worker hours in an array of objects
  for (let i = 1; i < timesheetArr.length; i++) {
    let row = timesheetArr[i]

    const worker = { ...protoObj }

    for (let j = 0; j < detailProperties.length; j++) {
      const detailVal = detailProperties[j];
      const rowVal = row[j];
      worker[detailVal] = rowVal
    }

    workerDetails.push(worker)

  }
  // console.log("workerDetails", workerDetails)
  // create individual entries (arrays) for each individual day of work
  let workerHoursArr = [["worker", "date", "hours"]]

  for (let i = 0; i < workerDetails.length; i++) {

    let workerObj = { ...workerDetails[i] }

    for (const prop of Object.keys(workerObj)) {

      if (prop == "Name" || workerObj[prop] == "") continue
      let workerLineItem = []
      workerLineItem.push(workerObj["Name"])
      workerLineItem.push(prop)
      workerLineItem.push(workerObj[prop])
      workerHoursArr.push(workerLineItem)
    }
  }

  // create a new sheet and paste data
  const dataCols = workerHoursArr[0].length
  const dataRows = workerHoursArr.length
  ss.insertSheet("Formatted Timesheet")
  const formattedSheet = ss.getSheetByName("Formatted Timesheet")
  const dataRange = formattedSheet.getRange(1, 1, dataRows, dataCols)
  dataRange.setValues(workerHoursArr)

  const hoursCol = formattedSheet.getRange(1, 3, dataRows , 1).getValues();
  let startTimeCol = [["start"]];
  let endTimeCol = [["end"]];

  hoursCol.forEach((row,i) => {
    if(i !== 0){
      const timeString = row[0];
    // if there are no numbers 
    if (timeString.match(/[0-9]/g) === null) {
      
      startTimeCol.push([""])
      endTimeCol.push([""])
    } else {
      let timeStringArr = timeString.split("-")
      const startTime = timeStringArr[0].trim();
      const endTime = timeStringArr[1].trim();
      startTimeCol.push([startTime])
      endTimeCol.push([endTime])
    }
    }
    
  })

  const startRange = formattedSheet.getRange(1,4,dataRows,1)
  const endRange = formattedSheet.getRange(1,5,dataRows,1)
  startRange.setValues(startTimeCol)
  endRange.setValues(endTimeCol)
} 
