import os
import datetime
from gabrielflor_it import app
from flask import render_template, send_from_directory

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/leaflet/poverty')
def leaflet_poverty():
    return render_template('leaflet/poverty.html', vars=dict(
        version=versioning()
        ))

@app.route('/d3/poverty')
def leaflet_d3():
    return render_template('d3/poverty.html', vars=dict(
        version=versioning()
        ))

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static/img'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

def versioning():
    return datetime.date.today().strftime('%y%m%d')



