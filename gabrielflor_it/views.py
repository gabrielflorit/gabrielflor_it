import os
from gabrielflor_it import app
from flask import render_template, send_from_directory

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static/img'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')



