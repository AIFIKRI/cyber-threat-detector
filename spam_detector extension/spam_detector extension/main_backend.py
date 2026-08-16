from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(silent=True) or {}
    text = data.get('text', '')
    
    # Logika deteksi kamu di sini
    return jsonify({
        "prediction": "SAFE",
        "result_text": f"Hasil analisis untuk: {text}"
    })

if __name__ == '__main__':
    app.run(port=5000)
