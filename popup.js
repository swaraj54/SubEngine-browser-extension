const textarea = document.getElementById("scrapedText");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  textarea.value = message.text;
});
