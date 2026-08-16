<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cyber Threat Detector AI</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 15px rgba(239, 68, 68, 0.2); }
      50% { box-shadow: 0 0 25px rgba(239, 68, 68, 0.4); }
    }
    .danger-card { animation: pulseGlow 2s infinite; }
  </style>
</head>
<body class="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
  
  <div class="max-w-xl w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
    <!-- Header -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-extrabold text-blue-400 mb-2">🛡️ Cyber Threat Detector</h1>
      <p class="text-slate-400 text-sm">Deteksi Otomatis Phishing, Malware, Judi Online & Pornografi</p>
    </div>

    <!-- Input Form -->
    <div class="space-y-4">
      <label class="block text-sm font-medium text-slate-300">Masukkan Link atau Teks Suspisius</label>
      <textarea id="webInput" rows="3" placeholder="Contoh: http://slot-gacor-maxwin.com atau pesan ajakan..." 
                class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-white outline-none resize-none transition-all"></textarea>
      
      <button onclick="checkSafetyWeb()" 
              class="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-blue-500/30">
        🔍 Analisis Keamanan
      </button>
    </div>

    <!-- Fitur Download Ekstensi Chrome (Saran Teman) -->
    <div class="mt-6 pt-5 border-t border-slate-700/80 text-center">
      <p class="text-xs text-slate-400 mb-2.5">Ingin deteksi otomatis saat browsing? Pasang ekstensinya:</p>
      <a href="cyber-threat-detector.zip" download 
         class="inline-flex items-center justify-center gap-2 w-full bg-slate-700/80 hover:bg-slate-600 text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl transition border border-slate-600">
        <span>🧩</span> Download Ekstensi Chrome (.zip)
      </a>
    </div>

    <!-- Kotak Hasil Analisis -->
    <div id="webResult" class="hidden mt-6"></div>
  </div>

  <script>
    async function checkSafetyWeb() {
      const rawInput = document.getElementById('webInput').value.trim();
      const resultDiv = document.getElementById('webResult');
      
      if (!rawInput) {
        alert("Silakan masukkan teks atau link terlebih dahulu!");
        return;
      }

      // Membersihkan sintaks Markdown link jika input bertipe markdown
      const textInput = rawInput.replace(/\[|\]|\(https?:\/\/[^\)]+\)/g, '').trim();

      resultDiv.className = "mt-6 p-4 rounded-xl border text-center font-bold bg-slate-700 text-slate-300 border-slate-600";
      resultDiv.innerHTML = "⏳ Menganalisis tingkat ancaman...";
      resultDiv.classList.remove('hidden');

      try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textInput })
        });

        const data = await response.json();

        if (data.result === 'SPAM') {
          resultDiv.className = "mt-6 p-5 rounded-xl border border-red-500/60 bg-red-950/40 text-left danger-card transition-all";
          resultDiv.innerHTML = `
            <div class="flex items-center justify-between mb-3 border-b border-red-500/30 pb-2">
              <span class="flex items-center gap-2 text-red-400 font-bold text-lg">
                <span>🚨</span> ANCAMAN TERDETEKSI
              </span>
              <span class="bg-red-500/20 text-red-300 text-xs px-2.5 py-1 rounded-full border border-red-500/40 uppercase tracking-wider font-semibold">
                High Risk
              </span>
            </div>
            <div class="space-y-2 text-sm">
              <p class="text-slate-300"><strong class="text-red-400">Penyebab:</strong> ${data.reason}</p>
              <p class="text-slate-400 text-xs leading-relaxed">
                <strong class="text-slate-300">Rekomendasi Tindakan:</strong> Hindari membuka tautan ini, jangan memasukkan data pribadi, dan hindari bertransaksi.
              </p>
            </div>
          `;
        } else {
          resultDiv.className = "mt-6 p-5 rounded-xl border border-green-500/60 bg-green-950/40 text-left transition-all";
          resultDiv.innerHTML = `
            <div class="flex items-center justify-between mb-3 border-b border-green-500/30 pb-2">
              <span class="flex items-center gap-2 text-green-400 font-bold text-lg">
                <span>✅</span> LINK / TEKS AMAN
              </span>
              <span class="bg-green-500/20 text-green-300 text-xs px-2.5 py-1 rounded-full border border-green-500/40 uppercase tracking-wider font-semibold">
                Clean
              </span>
            </div>
            <div class="space-y-2 text-sm">
              <p class="text-slate-300"><strong class="text-green-400">Hasil Analisis:</strong> ${data.reason}</p>
              <p class="text-slate-400 text-xs leading-relaxed">
                Tidak ditemukan kata kunci judi online, pornografi, maupun indikasi malware/phishing dari database ancaman.
              </p>
            </div>
          `;
        }
      } catch (err) {
        resultDiv.className = "mt-6 p-4 rounded-xl border border-amber-500/50 bg-amber-500/10 text-amber-400 text-center font-semibold text-sm";
        resultDiv.innerHTML = "⚠️ Gagal terhubung ke Backend Flask. Pastikan server lokal (`python maind_backend.py`) sudah berjalan!";
      }
    }
  </script>
</body>
</html>