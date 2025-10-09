from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
from PIL import Image
import json
import os
import random

app = Flask(__name__)
CORS(app)

# Simple face storage (stores user IDs with their image data)
FACE_DATA_FILE = 'registered_faces.json'
registered_faces = {}

def load_registered_faces():
    """Load registered faces from file"""
    global registered_faces
    if os.path.exists(FACE_DATA_FILE):
        try:
            with open(FACE_DATA_FILE, 'r') as f:
                registered_faces = json.load(f)
            print(f"✅ Loaded {len(registered_faces)} registered faces")
        except Exception as e:
            print(f"⚠️ Error loading faces: {e}")
            registered_faces = {}
    else:
        print("ℹ️ No registered faces found. Starting fresh.")
        registered_faces = {}

def save_registered_faces():
    """Save registered faces to file"""
    try:
        with open(FACE_DATA_FILE, 'w') as f:
            json.dump(registered_faces, f)
        print(f"✅ Saved {len(registered_faces)} registered faces")
    except Exception as e:
        print(f"⚠️ Error saving faces: {e}")

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AI Face Recognition Service (Simple Mode)',
        'version': '1.0.0',
        'registered_faces': len(registered_faces)
    })

@app.route('/api/recognize', methods=['POST'])
def recognize_face():
    """
    Recognize face from image
    NOTE: This is a simplified version for demo purposes.
    For production, use the full face-recognition library.
    """
    try:
        data = request.json
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Decode base64 image to verify it's valid
        try:
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
            
            # Verify image is valid
            image.verify()
            
        except Exception as e:
            return jsonify({'error': 'Invalid image data'}), 400
        
        # Check if we have any registered faces
        if len(registered_faces) == 0:
            return jsonify({
                'error': 'No registered faces in database. Please register faces first using the register-face endpoint.'
            }), 404
        
        # DEMO MODE: Return a random registered user
        # In production, this would use actual face recognition
        user_ids = list(registered_faces.keys())
        recognized_user_id = random.choice(user_ids)
        confidence = random.uniform(85, 98)
        
        print(f"✅ Face recognized: User {recognized_user_id} (Confidence: {confidence:.2f}%)")
        
        return jsonify({
            'userId': recognized_user_id,
            'confidence': round(confidence, 2)
        })
        
    except Exception as e:
        print(f"❌ Error in recognize_face: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/register-face', methods=['POST'])
def register_face():
    """Register a new face for a user"""
    try:
        data = request.json
        user_id = data.get('userId')
        image_data = data.get('image')
        user_name = data.get('userName', 'Unknown')
        
        if not user_id or not image_data:
            return jsonify({'error': 'userId and image are required'}), 400
        
        # Decode and verify image
        try:
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
            image.verify()
            
        except Exception as e:
            return jsonify({'error': 'Invalid image data'}), 400
        
        # Store user face data
        registered_faces[user_id] = {
            'userName': user_name,
            'registeredAt': str(os.path.getmtime(__file__) if os.path.exists(__file__) else 0)
        }
        
        save_registered_faces()
        
        print(f"✅ Face registered for user: {user_name} (ID: {user_id})")
        
        return jsonify({
            'success': True,
            'message': f'Face registered successfully for {user_name}',
            'totalRegistered': len(registered_faces)
        })
        
    except Exception as e:
        print(f"❌ Error in register_face: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/registered-faces', methods=['GET'])
def get_registered_faces():
    """Get list of registered faces"""
    return jsonify({
        'success': True,
        'registeredUsers': list(registered_faces.keys()),
        'count': len(registered_faces),
        'faces': registered_faces
    })

@app.route('/api/delete-face', methods=['DELETE'])
def delete_face():
    """Delete a registered face"""
    try:
        data = request.json
        user_id = data.get('userId')
        
        if not user_id:
            return jsonify({'error': 'userId is required'}), 400
        
        if user_id in registered_faces:
            del registered_faces[user_id]
            save_registered_faces()
            return jsonify({
                'success': True,
                'message': f'Face deleted for user {user_id}'
            })
        else:
            return jsonify({'error': 'User face not found'}), 404
            
    except Exception as e:
        print(f"❌ Error in delete_face: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("🤖 AI Face Recognition Service Starting...")
    print("=" * 60)
    print("📡 Mode: SIMPLE (Demo Mode - No ML required)")
    print("📡 Loading registered faces...")
    load_registered_faces()
    print(f"✅ Service ready with {len(registered_faces)} registered faces")
    print("=" * 60)
    print("🚀 Server running on http://localhost:8000")
    print("📝 Note: This is a simplified version for demo purposes")
    print("   For production, use app.py with face-recognition library")
    print("=" * 60)
    app.run(host='0.0.0.0', port=8000, debug=True)
