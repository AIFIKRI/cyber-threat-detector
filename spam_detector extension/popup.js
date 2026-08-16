document.getElementById('checkBtn').addEventListener('click', async () => {
  const rawInput = document.getElementById('inputText').value.trim();
  const resultDiv = document.getElementById('result');

  if (!rawInput) {
    alert("Masukkan teks atau link terlebih dahulu!");
    return;
  }

  const textInput = rawInput.replace(/\[|\]|\(https?:\/\/[^\)]+\)/g, '').trim();

  resultDiv.style.display = "block";
  resultDiv.className = "result-box status-loading";
  resultDiv.innerHTML = "⏳ Menganalisis tingkat ancaman...";

  try {
    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textInput })
    });

    const data = await response.json();

    if (data.result === 'SPAM') {
      resultDiv.className = "result-box status-spam";
      resultDiv.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 4px; color: #f87171;">🚨 ANCAMAN TERDETEKSI</div>
        <div style="font-size: 11px;">
          <strong>Penyebab:</strong> ${data.reason}<br>
          <span style="color: #cbd5e1; font-size: 10px; display: block; margin-top: 4px;">⚠️ Hindari membuka tautan ini.</span>
        </div>
      `;
    } else {
      resultDiv.className = "result-box status-ham";
      resultDiv.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 4px; color: #4ade80;">✅ TEKS / LINK AMAN</div>
        <div style="font-size: 11px;">
          <strong>Hasil:</strong> ${data.reason}
        </div>
      `;
    }
  } catch (error) {
    resultDiv.className = "result-box status-spam";
    resultDiv.innerHTML = "⚠️ Gagal terhubung ke Backend Flask!";
  }
});