import os
import datetime
from gabrielflor_it import app
from flask import render_template, send_from_directory

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/counties')
def counties():
    return render_template('d3/counties.html', vars=dict(
        version=versioning()
        ))

@app.route('/blog-choropleth-classification-systems')
def blog_choropleth_classification_systems():
    return render_template('blog/choropleth-classification-systems.html', vars=dict(
        version=versioning()
        ))

@app.route('/a-half-decade-of-rising-poverty')
def a_half_decade_of_rising_poverty():
    return render_template('d3/poverty-by-county.html', vars=dict(
        version=versioning()
        ))

@app.route('/blog-a-half-decade-of-rising-poverty')
def blog_a_half_decade_of_rising_poverty():
    return render_template('blog/a-half-decade-of-rising-poverty.html', vars=dict(
        version=versioning()
        ))

@app.route('/blair')
def blair():
    return render_template('d3/blair.html', vars=dict(
        version=versioning()
        ))

@app.route('/aca-puma')
def aca_puma():
    return render_template('aca-puma.html', vars=dict(
        version=versioning()
        ))

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static/img'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

def versioning():
    return datetime.date.today().strftime('%y%m%d')
