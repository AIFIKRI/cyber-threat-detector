document.getElementById('checkBtn').addEventListener('click', async () => {
  const rawInput = document.getElementById('inputText').value;
  const resultDiv = document.getElementById('result');

  if (!rawInput.trim()) {
    resultDiv.style.display = "block";
    resultDiv.className = "result-box status-loading";
    resultDiv.innerHTML = "Harap masukkan teks atau link terlebih dahulu.";
    return;
  }

  const textInput = rawInput.replace(/\[|\]|\(https?:\/\/[^\)]+\)/g, '');

  resultDiv.style.display = "block";
  resultDiv.className = "result-box status-loading";
  resultDiv.innerHTML = "⏳ Menganalisis tingkat ancaman...";

  try {
    const response = await fetch('https://cyber-threat-detector-theta.vercel.app/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textInput })
    });

    const data = await response.json();

    if (response.ok) {
      const isSpam = data.is_spam || data.result?.toLowerCase().includes('spam') || data.result?.toLowerCase().includes('bahaya');
      resultDiv.className = `result-box ${isSpam ? 'status-spam' : 'status-ham'}`;
      resultDiv.innerHTML = `<strong>Hasil Analisis:</strong><br>${data.result || JSON.stringify(data)}`;
    } else {
      resultDiv.className = "result-box status-spam";
      resultDiv.innerHTML = `Terjadi kesalahan: ${data.error || 'Gagal memproses request'}`;
    }
  } catch (error) {
    resultDiv.className = "result-box status-spam";
    resultDiv.innerHTML = `Gagal terhubung ke server. Periksa koneksi internet Anda.`;
    console.error("Error:", error);
  }
});