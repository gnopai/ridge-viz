from flask import Blueprint, jsonify, request, abort, make_response
import numpy as np
from api.kernels import createKernel, getKernelConfigs
from api.data import make_fake_data
from api.util import build_img_src_from_plot
import api.ridge as ridge

api_blueprint = Blueprint("api", __name__)


@api_blueprint.route('/health')
def health():
    return jsonify({'message': 'OK'})


@api_blueprint.route('/kernels', methods=['GET'])
def kernelConfigs():
    kernelConfigs = getKernelConfigs()
    return jsonify({'kernelConfigs': kernelConfigs})


@api_blueprint.route('/ridge', methods=['POST'])
def ridge_regression():
    dataset = make_fake_data()
    n = len(dataset[0])

    body = request.get_json()
    kernel = _getKernelForRequest(body)
    lamb = body.get('lambda')

    ridge_x = np.linspace(0, n, 1000)
    ridge_y = ridge.ridge_regression(kernel, lamb, dataset, ridge_x)
    plot_ridge = lambda plt: plt.plot(dataset[0], dataset[1], 'b.', ridge_x, ridge_y, '-r')
    image_src = build_img_src_from_plot(plot_ridge)
    return jsonify({'message': 'OK', 'img_src': image_src})


def _getKernelForRequest(body):
    kernelParam = body.get('kernelParamName')
    kernelParamValue = body.get('kernelParamValue')
    kernelParams = {}
    if kernelParam and kernelParamValue is not None:
        kernelParams = { kernelParam: kernelParamValue }

    try:
        return createKernel(body.get('kernel'), **kernelParams)
    except:
        abort(error_response(400, 'Invalid kernel and/or parameters specified'))


def error_response(status_code, message):
    return make_response(jsonify({'message': message}), status_code)

