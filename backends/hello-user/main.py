from flask import Flask, request

app = Flask(__name__)


@app.route("/")
def hello_user():
    user_id = request.headers['auth_id']
    return "Hello {}!".format(user_id)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
