chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed!");
});

chrome.alarms.create("fetchData", { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "fetchData") {
    fetch("http://127.0.0.1:5000/api/getApplications")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data in background:", data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }
});