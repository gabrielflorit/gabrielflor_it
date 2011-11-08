###Setup

This app uses virtualenv. If you haven't done so, create one first:

    cd gabrielflor_it
    virtualenv --no-site-packages .


Next, source the virtualenv:

    . bin/activate


Install dependencies with Pip:

    bin/pip install -r requirements.txt


And finally start the Flask server (this is perfectly fine for development):

    python runserver.py


Or the gunicorn server (what we use on production):

    gunicorn gabrielflor_it:app -b "0.0.0.0:5000"


Access the app at http://0.0.0.0:5000.

