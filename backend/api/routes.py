from flask import Blueprint, jsonify

api_blueprint = Blueprint("api", __name__)


@api_blueprint.route('/health')
def health():
    return jsonify({'message': 'OK'})


