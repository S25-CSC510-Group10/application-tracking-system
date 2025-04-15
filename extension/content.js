console.log("Content script loaded!");

fetch("http://127.0.0.1:5000/api/getApplications")
  .then((response) => response.json())
  .then((data) => {
    console.log("Applications from content script:", data);
  })
  .catch((error) => console.error("Error fetching applications:", error));