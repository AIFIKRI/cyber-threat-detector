from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Mengizinkan akses dari Chrome Extension dan mendukung method OPTIONS (preflight)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        return response, 200

    try:
        data = request.get_json() or {}
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'Teks tidak boleh kosong'}), 400
            
        is_suspicious = "pornhub" in text.lower() or "phishing" in text.lower() or "pornyndex" in text.lower()
        
        return jsonify({
            'status': 'success',
            'is_suspicious': is_suspicious,
            'message': 'Situs Berbahaya!' if is_suspicious else 'Situs Aman'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run()
