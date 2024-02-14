import requests
from flask import Flask, request
from random import randint

app = Flask(__name__, static_url_path="", static_folder="static")

@app.route("/")
def home():
    return app.send_static_file("index.html")

@app.route("/r")
def roll():
    try:
        num = int(request.args["num"])
        dmax = int(request.args["max"])
    except (KeyError, ValueError) as e:
        return repr(e), 400

    if not 0 <= num <= 10000:
        return "Error: Number of rolls must be in [0, 10000]", 400
    if not 1 <= dmax <= 10000:
        return "Error: Number of faces must be in [1, 10000]", 400

    use_trng = request.args.get("trng") == "true"
    if not use_trng:
        return [randint(1, dmax) for _ in range(num)]

    # https://www.random.org/integers/
    payload = {
        "num": num,
        "min": 1,
        "max": dmax,
        "col": 1,
        "base": 10,
        "format": "plain",
        "rnd": "new",
    }
    r = requests.get("https://www.random.org/integers", params=payload)
    return [int(n) for n in r.text.splitlines()]

# Tell Flask it is Behind a Proxy
# https://flask.palletsprojects.com/en/3.0.x/deploying/proxy_fix/
from werkzeug.middleware.proxy_fix import ProxyFix

app.wsgi_app = ProxyFix(
    app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
)

if __name__ == "__main__":
    app.run()

