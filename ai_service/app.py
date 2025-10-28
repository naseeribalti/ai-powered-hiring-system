from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'

# Create upload directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def hello():
    return jsonify({
        "message": "AI Service is running!",
        "version": "1.0.0",
        "timestamp": "2024-01-01T00:00:00Z"
    })

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "service": "ai-hiring-service",
        "timestamp": "2024-01-01T00:00:00Z"
    })

# AI Service API routes (to be implemented)
@app.route('/api/parse-resume', methods=['POST'])
def parse_resume():
    """Parse resume and extract skills, experience, etc."""
    return jsonify({
        "message": "Parse resume endpoint - to be implemented",
        "status": "placeholder"
    })

@app.route('/api/match-jobs', methods=['POST'])
def match_jobs():
    """Match candidate profile with available jobs"""
    return jsonify({
        "message": "Match jobs endpoint - to be implemented",
        "status": "placeholder"
    })

@app.route('/api/extract-skills', methods=['POST'])
def extract_skills():
    """Extract skills from text or resume"""
    return jsonify({
        "message": "Extract skills endpoint - to be implemented",
        "status": "placeholder"
    })

@app.route('/api/analyze-job-description', methods=['POST'])
def analyze_job_description():
    """Analyze job description and extract requirements"""
    return jsonify({
        "message": "Analyze job description endpoint - to be implemented",
        "status": "placeholder"
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(413)
def too_large(error):
    return jsonify({'error': 'File too large'}), 413

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    print(f"🤖 AI Service starting on port {port}")
    print(f"🔧 Debug mode: {debug}")
    print(f"📁 Upload folder: {app.config['UPLOAD_FOLDER']}")
    
    app.run(debug=debug, port=port, host='0.0.0.0')
