function getGeoLoc() {

  // Define Redash API endpoint and API key
  const redashBaseUrl = '';
  const apiKey = '';

  // Define the query ID you want to refresh
  const queryId = ;

  // Compose the API URL for triggering a refresh of the query
  const refreshUrl = `${redashBaseUrl}/api/queries/${queryId}/results`;

  // Set up the headers for the request
  const headers = {
    'Authorization': `Key ${apiKey}`,
    'Content-Type': 'application/json',
  };

  let week_end = new Date;
  // find the day of the month and subtract the day of the week to get to Sunday (0 = Sun , 1 = Mon , 2 = Tuesday )
  const end_day = week_end.getDate() - week_end.getDay()
  week_end.setDate(end_day) // Sunday 

  let week_start = new Date;
  start_day = end_day - 6;
  week_start.setDate(start_day);

  week_end = Utilities.formatDate(week_end, 'Europe/London', 'yyyy-MM-dd').toString()
  week_start = Utilities.formatDate(week_start, 'Europe/London', 'yyyy-MM-dd').toString()
  console.log("week start", week_start)
  console.log("week end", week_end)

  const params = {
    "parameters": {
      "employer_id": "",
      "date_range": {
        "start": week_start,
        "end": week_end
      }
    },
    "max_age": 0

  }

  // Make a POST request to refresh the query
  const postOptions = {
    'method': 'post',
    'headers': headers,
    'payload': JSON.stringify(params)
  };

  const getOptions = {
    'method': 'get',
    'headers': headers,
  };


  let response = UrlFetchApp.fetch(refreshUrl, postOptions)

  console.log(response.getResponseCode())
  console.log(response.getContentText())

  if ("job" in JSON.parse(response.getContentText())) {

    console.log("helloooo")
    let jobObj = JSON.parse(response.getContentText())
    console.log(jobObj)
    const jobUrl = `${redashBaseUrl}/api/queries/${queryId}/jobs/${jobObj.job.id}`

    // 1 == PENDING (waiting to be executed)
    // 2 == STARTED (executing)
    // 3 == SUCCESS
    // 4 == FAILURE
    // 5 == CANCELLED 

    Logger.log(jobObj.job.status)

    while (jobObj.job.status < 3) {
      // While query isn't ready (pending or executing), poll for results every 1second.
      // Polling time can be updated if you know that the query might take longer.
      let refetch = UrlFetchApp.fetch(jobUrl, getOptions)
      jobObj = JSON.parse(refetch.getContentText())
      console.log("waiting....")
      console.log("Status:", jobObj.job.status)
      console.log("jobObj", jobObj)
      Utilities.sleep(5000)
    }

    // /api/query_results/<query_result_id>
    const resultsUrl = `${redashBaseUrl}/api/query_results/${jobObj.job.query_result_id}.csv`

    if (jobObj.job.status === 3) {
      const refreshedRes = UrlFetchApp.fetch(resultsUrl, getOptions)

      let data = refreshedRes.getContentText()
      console.log("data", data)
      dataArr = Utilities.parseCsv(data)
      let dataRows = dataArr.length;
      let dataCols = dataArr[0].length;
      Logger.log(dataRows);
      Logger.log(dataCols);
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const acpSheet = ss.getSheetByName("");
      acpSheet.getRange(1, 1, dataRows, dataCols).setValues(dataArr,);

    } else {
      throw Error("Failed loading result");
    }
  }
}
