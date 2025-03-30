try:
    from flask import Flask, jsonify, request, render_template
    from flask_cors import CORS
    from werkzeug.utils import secure_filename
    import hashlib
    import json
    import os
    from pathlib import Path
    from shutil import copyfile

    from dotenv import load_dotenv

except ModuleNotFoundError as e:
    print("""\n \t==> Erreur durant l'importation. \n 
            \tVérifiez que les librairies nécessaires sont installées et que venv est activé. Se référer au README. \n\n 
            \tLancez avec les commandes suivantes: \n 
            \t$python -m venv venv \n 
            \t$source venv/bin/activate \n 
            \t$pip install -r requirements.txt \n 
            \t$python3 main.py""")
    exit()

load_dotenv()

MAX_CONTENT_LENGTH = 512 * 1024 * 1024  # 512 MB
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'mp4'}
ADMIN_PW = os.getenv('ADMIN_PW')
IP = os.getenv('NEXT_PUBLIC_LOCALIP')

# Create a Flask application instance
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER')
app.config['CURRENT_DISPLAYED_IMG_FOLDER'] = os.getenv('CURRENT_DISPLAYED_IMG_FOLDER')
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

CORS(app)

scores = {
    'toges': 0,
    'non-toges': 0,
}


def is_allowed_file(filename):
    return '.' in filename and \
        get_file_extension(filename) in ALLOWED_EXTENSIONS


def get_file_extension(filename):
    return filename.rsplit('.', 1)[1].lower()


def copy_file_to_displayed_folder(filename):
    # Copy the file to the current displayed image folder
    try:
        copyfile(os.path.join(app.config['UPLOAD_FOLDER'], filename),
                 os.path.join(app.config['CURRENT_DISPLAYED_IMG_FOLDER'], "image." + get_file_extension(filename)))
    except:
        print("Error copying file to current displayed image folder")
    try:
        # remove all files in the folder except the last one
        files = os.listdir(app.config['CURRENT_DISPLAYED_IMG_FOLDER'])
        for file in files:
            if file != "image." + get_file_extension(filename):
                os.remove(os.path.join(app.config['CURRENT_DISPLAYED_IMG_FOLDER'], file))
    except:
        print("Error removing files from current displayed image folder")


def log_feedback(data):
    with open("db/resources/feedback.txt", "a") as file:
        file.write(data['feedback'] + "\n")
        file.close()


def save_scores():
    with open(os.getenv('SCORES_FILE'), 'w') as f:
        json.dump(scores, f)


def load_scores():
    global scores
    if os.path.exists(os.getenv('SCORES_FILE')):
        with open(os.getenv('SCORES_FILE'), 'r') as f:
            scores = json.load(f)


# Define a simple route
@app.route('/', methods=['GET'])
def hello_world():
    return """
        <p>Hello from the Rasb 🍓 !<p>
        <p><a href="/cli">Link<a> to the cli page</p>
        <p><a href="/change_display">Link<a> to the change_display page</p>
        """


@app.route('/random_img', methods=['GET'])
def random_img():
    print("test")
    directory = Path("static/uploaded_files")
    files = [f for f in directory.iterdir() if f.is_file()]
    files_sorted = sorted(files, key=lambda f: f.stat().st_ctime)
    print(files_sorted)
    if len(files_sorted):
        last_images = files_sorted[len(files_sorted)-1]
        print(last_images)
        last_images_string = str(last_images).split("\\")[-1]
        print(last_images_string)
        # image_files = os.listdir("./db/resources/uploaded_files")
        # image_files.sort(key=os.path.getmtime)
        # print(image_files[1:10])
        return jsonify({'imageName': last_images_string})
    return jsonify({'imageName': 'static/default.png'})

@app.route('/home_screen', methods=['GET'])
def get_home_screen():
    # get filename in the current displayed image folder
    try:
        files = os.listdir(app.config['CURRENT_DISPLAYED_IMG_FOLDER'])
    except:
        raise FileNotFoundError

    try:
        return render_template('display.html')
    except:
        raise Exception


@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return {'message': 'No file part'}, 400

    # Get the file from the request
    file = request.files['file']

    if file.filename == '':
        return {'message': 'No selected file'}, 400

    # Save the file
    if file and is_allowed_file(file.filename):
        filename = secure_filename(file.filename)  # prevent targeting external directories
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        copy_file_to_displayed_folder(filename)
        print("File uploaded successfully")
        # Return a response
        return jsonify({
            'message': 'File uploaded successfully',
            'status': 'success'
        })
    else:
        return jsonify({
            'message': 'Unknown error or file not allowed',
            'status': 'error'
        })


@app.route('/api/feedback', methods=['POST'])
def post_feedback():
    data = {'feedback': request.data.decode('utf-8')}
    log_feedback(data)
    return jsonify({
        'received_data': data,
        'status': 'success'
    })


@app.route('/api/score', methods=['GET', 'POST'])
def api():
    if request.method == 'POST':
        data = request.get_json()
        operation = data.get('operation')
        cercle = data.get('cercle')

        if operation == 'add':
            scores[cercle] += 1
        elif operation == 'sub' and scores[cercle] > 0:
            scores[cercle] -= 1
        save_scores()
        return jsonify({'succeed': True, 'scores': scores})
    else:
        return jsonify(scores)


@app.route('/cli', methods=['POST'])
def cli():
    pw = request.get_json()["pw"]
    pw_hashed = hashlib.sha256(pw.encode()).hexdigest()
    if pw_hashed == ADMIN_PW:
        return jsonify({'succeed': True}), 200
    else:
        return jsonify({'succeed': False}), 403


#@app.route('/change_display_api', methods=['GET', 'POST'])
#def change_display_api():
#    if request.method == 'POST':
#        data = request.get_json()
#        if data.get('operation') == 'enfer':
#            os.system(f'firefox --kiosk {os.getenv('IP_ADDRESS_FRONTEND')}/score')
#        if data.get('operation') == 'enfer':
#            os.system(f'firefox --kiosk {os.getenv('IP_ADDRESS_FRONTEND')}/image')


# Run the application
if __name__ == '__main__':
    load_scores()
    app.run(host='0.0.0.0', port=5000, debug=True)
    save_scores()
