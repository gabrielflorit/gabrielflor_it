import os
import datetime
from gabrielflor_it import app
from flask import render_template, send_from_directory

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/polymaps/counties')
def polymaps_counties():
    return render_template('polymaps/counties.html', vars=dict(
        version=versioning()
        ))

@app.route('/polymaps/counties-bing')
def polymaps_counties_bing():
    return render_template('polymaps/counties-bing.html', vars=dict(
        version=versioning()
        ))

@app.route('/leaflet/counties')
def leaflet_counties():
    return render_template('leaflet/counties.html', vars=dict(
        version=versioning()
        ))

@app.route('/d3/counties')
def d3_counties():
    return render_template('d3/counties.html', vars=dict(
        version=versioning()
        ))

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static/img'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

def versioning():
    return datetime.date.today().strftime('%y%m%d')



