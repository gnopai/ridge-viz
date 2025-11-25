from flask import Flask, send_from_directory, make_response, jsonify, abort
from api.routes import api_blueprint

app = Flask(
    __name__,
    static_folder="static",
    static_url_path="/"
)

app.register_blueprint(api_blueprint, url_prefix="/api")


# Serve React index.html
@app.route("/")
def serve_index():
    return send_from_directory(app.static_folder, "index.html")


# React router support
@app.route("/<path:path>")
def serve_react(path):
    return send_from_directory(app.static_folder, "index.html")


@app.errorhandler(404)
def page_not_found(error):
    return error_response(404, 'Route not found')


def validate_parameter_present(all_params, param):
    if param not in all_params:
        abort(error_response(400, f'Query parameter \'{param}\' is required'))


def error_response(status_code, message):
    return make_response(jsonify({'message': message}), status_code)


if __name__ == "__main__":
    app.run(port=8000, debug=True)

