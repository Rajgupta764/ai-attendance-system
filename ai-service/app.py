from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition
import numpy as np
import base64
import io
from PIL import Image
import os
import json

app = Flask(__name__)
CORS(app)

# Store face encodings (in production, use database)
# Format: { "user_id": face_encoding_array }
FACE_DATA_FILE = 'face_encodings.json'
known_face_encodings = {}

def load_face_encodings():
    """Load face encodings from file"""
    global known_face_encodings
    if os.path.exists(FACE_DATA_FILE):
        try:
            with open(FACE_DATA_FILE, 'r') as f:
                data = json.load(f)
                # Convert lists back to numpy arrays
                known_face_encodings = {
                    user_id: np.array(encoding) 
                    for user_id, encoding in data.items()
                }
            print(f"✅ Loaded {len(known_face_encodings)} face encodings")
        except Exception as e:
            print(f"⚠️ Error loading face encodings: {e}")
            known_face_encodings = {}
    else:
        print("ℹ️ No face encodings file found. Starting fresh.")
        known_face_encodings = {}

def save_face_encodings():
    """Save face encodings to file"""
    try:
        # Convert numpy arrays to lists for JSON serialization
        data = {
            user_id: encoding.tolist() 
            for user_id, encoding in known_face_encodings.items()
        }
        with open(FACE_DATA_FILE, 'w') as f:
            json.dump(data, f)
        print(f"✅ Saved {len(known_face_encodings)} face encodings")
    except Exception as e:
        print(f"⚠️ Error saving face encodings: {e}")

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AI Face Recognition Service',
        'version': '1.0.0',
        'registered_faces': len(known_face_encodings)
    })

@app.route('/api/recognize', methods=['POST'])
def recognize_face():
    """Recognize face from image"""
    try:
        data = request.json
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Decode base64 image
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        image_np = np.array(image)
        
        # Find faces in image
        face_locations = face_recognition.face_locations(image_np)
        
        if len(face_locations) == 0:
            return jsonify({'error': 'No face detected in image'}), 404
        
        # Get face encodings
        face_encodings = face_recognition.face_encodings(image_np, face_locations)
        
        if len(face_encodings) == 0:
            return jsonify({'error': 'Could not encode face'}), 404
        
        # Check if we have any registered faces
        if len(known_face_encodings) == 0:
            return jsonify({'error': 'No registered faces in database. Please register faces first.'}), 404
        
        # Compare with known faces
        best_match_user_id = None
        best_confidence = 0
        
        for user_id, known_encoding in known_face_encodings.items():
            # Compare faces
            matches = face_recognition.compare_faces([known_encoding], face_encodings[0], tolerance=0.6)
            
            if matches[0]:
                # Calculate confidence
                face_distances = face_recognition.face_distance([known_encoding], face_encodings[0])
                confidence = (1 - face_distances[0]) * 100
                
                if confidence > best_confidence:
                    best_confidence = confidence
                    best_match_user_id = user_id
        
        if best_match_user_id and best_confidence > 60:
            return jsonify({
                'userId': best_match_user_id,
                'confidence': round(best_confidence, 2)
            })
        else:
            return jsonify({'error': 'Face not recognized or confidence too low'}), 404
        
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
        
        if not user_id or not image_data:
            return jsonify({'error': 'userId and image are required'}), 400
        
        # Decode base64 image
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        image_np = np.array(image)
        
        # Get face encoding
        face_locations = face_recognition.face_locations(image_np)
        
        if len(face_locations) == 0:
            return jsonify({'error': 'No face detected in image'}), 400
        
        face_encodings = face_recognition.face_encodings(image_np, face_locations)
        
        if len(face_encodings) == 0:
            return jsonify({'error': 'Could not encode face'}), 400
        
        # Store encoding
        known_face_encodings[user_id] = face_encodings[0]
        save_face_encodings()
        
        return jsonify({
            'success': True,
            'message': f'Face registered successfully for user {user_id}',
            'totalRegistered': len(known_face_encodings)
        })
        
    except Exception as e:
        print(f"❌ Error in register_face: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/delete-face', methods=['DELETE'])
def delete_face():
    """Delete a registered face"""
    try:
        data = request.json
        user_id = data.get('userId')
        
        if not user_id:
            return jsonify({'error': 'userId is required'}), 400
        
        if user_id in known_face_encodings:
            del known_face_encodings[user_id]
            save_face_encodings()
            return jsonify({
                'success': True,
                'message': f'Face deleted for user {user_id}'
            })
        else:
            return jsonify({'error': 'User face not found'}), 404
            
    except Exception as e:
        print(f"❌ Error in delete_face: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/registered-faces', methods=['GET'])
def get_registered_faces():
    """Get list of registered face user IDs"""
    return jsonify({
        'success': True,
        'registeredUsers': list(known_face_encodings.keys()),
        'count': len(known_face_encodings)
    })

if __name__ == '__main__':
    print("🤖 AI Face Recognition Service Starting...")
    print("📡 Loading face encodings...")
    load_face_encodings()
    print(f"✅ Service ready with {len(known_face_encodings)} registered faces")
    print("🚀 Starting server on http://localhost:8000")
    app.run(host='0.0.0.0', port=8000, debug=True)
