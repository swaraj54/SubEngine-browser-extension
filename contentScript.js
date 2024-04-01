function scrapeText() {
  console.log("st function called.");
  const citeElements = document.querySelectorAll("cite");
  const urls = [];

  citeElements.forEach((citeElement) => {
    const url = citeElement.textContent.split("›")[0].trim();
    urls.push(url);
  });

  const data = { urls: urls };

  fetch("https://subengine-backend.onrender.com/analyze-urls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Response from server:", data);
      const results = data.results;

      const targetDivs = document.querySelectorAll(".q0vns");

      targetDivs.forEach((targetDiv) => {
        const urlElement = targetDiv.querySelector("cite");
        if (urlElement) {
          const url = urlElement.textContent.split("›")[0].trim(); // Extract the URL

          const matchingResult = results.find((result) => result.url === url);

          if (matchingResult) {
            const newDiv = document.createElement("div");
            newDiv.textContent = matchingResult.source;
            targetDiv.appendChild(newDiv);
            if (
              ["Review Needed", "Data not found", "Not exist"].includes(
                matchingResult.source
              )
            ) {
              const prButton = document.createElement("button");
              prButton.textContent = "Potential Resource ?";
              prButton.onclick = () => {
                sendFeedback(url, "Potential Resource");
                prButton.style.display = "none";
                rnButton.style.display = "none";
              };
              targetDiv.appendChild(prButton);

              const rnButton = document.createElement("button");
              rnButton.textContent = "Review Needed ?";
              rnButton.onclick = () => {
                sendFeedback(url, "Review Needed");
                prButton.style.display = "none";
                rnButton.style.display = "none";
              };
              targetDiv.appendChild(rnButton);
              prButton.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
              });

              rnButton.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
              });
            }
          } else {
            const newDiv = document.createElement("div");
            newDiv.textContent = "Source not found";
            targetDiv.appendChild(newDiv);
          }
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function sendFeedback(url, feedback) {
  fetch("https://subengine-backend.onrender.com/record-feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, feedback }),
  })
    .then((response) => {
      if (!response.success) {
        throw new Error("Failed to record feedback");
      } else {
        alert("Review Recorded.");
      }
    })
    .catch((error) => {
      console.error("Error recording feedback:", error);
    });
}

chrome.runtime.sendMessage({ urls: scrapeText() });
