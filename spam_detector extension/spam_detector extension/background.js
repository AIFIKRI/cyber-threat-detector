chrome.runtime.onInstalled.addListener(() => {
  console.log("Cyber Threat Detector extension installed.");
});

// Listener jika background script perlu melakukan request ke server
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeText") {
    fetch("https://cyber-threat-detector-theta.vercel.app/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: request.text })
    })
      .then((response) => response.json())
      .then((data) => sendResponse({ success: true, data: data }))
      .catch((error) => sendResponse({ success: false, error: error.message }));

    return true; // Menandakan async response
  }
});