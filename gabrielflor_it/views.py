import os
# import datetime
from gabrielflor_it import app
# from util.crossdomain import crossdomain
from flask import render_template, send_from_directory, redirect

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/water')
def water():
    return redirect('http://livecoding.io')

@app.route('/blog-water')
def blog_water():
    return redirect('http://gabrielflor.it')

@app.route('/counties')
def counties():
    return render_template('counties.html')

@app.route('/a-half-decade-of-rising-poverty')
def a_half_decade_of_rising_poverty():
    return render_template('poverty-by-county.html')

@app.route('/blog-a-half-decade-of-rising-poverty')
def blog_a_half_decade_of_rising_poverty():
    return redirect('http://gabrielflor.it')

@app.route('/blog-choropleth-classification-systems')
def blog_choropleth_classification_systems():
    return redirect('http://gabrielflor.it')
    
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static/img'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

# def versioning():
#     return datetime.date.today().strftime('%y%m%d')
