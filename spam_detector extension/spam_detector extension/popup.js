document.addEventListener("DOMContentLoaded", async () => {
  const inputText = document.getElementById("inputText");
  const resultDiv = document.getElementById("result");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  // Fitur Otomatis: Mengambil teks yang sedang diblok/diseleksi di halaman web
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection().toString()
      });
      if (result && result.trim() !== "") {
        inputText.value = result.trim();
      }
    }
  } catch (err) {
    console.log("Tidak ada teks terblok:", err);
  }

  // Fitur Download File
  downloadBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // Ganti URL di bawah dengan link file download kamu jika ada
    const fileUrl = "https://cyber-threat-detector-theta.vercel.app/"; 
    window.open(fileUrl, "_blank");
  });

  // Fitur Analisis Keamanan via Backend Vercel
  analyzeBtn.addEventListener("click", async () => {
    const text = inputText.value.trim();

    if (!text) {
      resultDiv.className = "result-box status-spam";
      resultDiv.innerHTML = "Masukkan teks atau link terlebih dahulu!";
      return;
    }

    resultDiv.className = "result-box";
    resultDiv.innerHTML = "Menganalisis...";

    try {
      const response = await fetch("https://cyber-threat-detector-theta.vercel.app/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.is_suspicious) {
          resultDiv.className = "result-box status-spam";
          resultDiv.innerHTML = `⚠️ WASPADA: ${data.message}`;
        } else {
          resultDiv.className = "result-box status-safe";
          resultDiv.innerHTML = `✅ AMAN: ${data.message}`;
        }
      } else {
        resultDiv.className = "result-box status-spam";
        resultDiv.innerHTML = `Terjadi kesalahan: ${data.error || 'Gagal memproses request'}`;
      }
    } catch (error) {
      resultDiv.className = "result-box status-spam";
      resultDiv.innerHTML = "Gagal terhubung ke server. Periksa koneksi internet Anda.";
      console.error("Error:", error);
    }
  });
});