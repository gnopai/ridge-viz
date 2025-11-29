from flask import Blueprint, jsonify, request, abort, make_response
import numpy as np
from api.kernels import createKernel, getKernelConfigs
from api.data import sample_gaussian_data
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
    dataset = sample_gaussian_data(np.arange(255))
    n = dataset.length()

    body = request.get_json()
    kernel = _getKernelForRequest(body)
    lamb = body.get('lambda')

    ridge_x = np.linspace(0, n, 1000)
    all_ridge_y = [ridge.ridge_regression(kernel, lamb, (dataset.x, y), ridge_x) for y in dataset.y_samples]
    plot_ridge = lambda plt: plt.plot(dataset.x, dataset.y_samples[0], 'b.', ridge_x, all_ridge_y[0], '-r')
    ridge_plot_img = build_img_src_from_plot(plot_ridge)
    #mse_plot_img = build_img_src_from_plot(mse_plotter(dataset))

    return jsonify({'message': 'OK', 'ridge_plot': ridge_plot_img})


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

