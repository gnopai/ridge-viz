from flask import Blueprint, jsonify, request, abort, make_response
import numpy as np
from api.kernels import createKernel, getKernelConfigs
from api.data import default_gaussian_process
from api.util import build_img_src_from_plot
from api.stats import mse_plotter
from api.ridge import ridge_regression as do_ridge_reg, plot_ridge_regression

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
    body = request.get_json()

    run_count = body.get('runs', 5)
    data_process = default_gaussian_process
    dataset = data_process.sample(np.arange(255), run_count)
    n = dataset.length()

    kernel = _getKernelForRequest(body)
    lamb = body.get('lambda')

    ridge_x = np.linspace(0, n, 1000)
    all_ridge_y = np.array([do_ridge_reg(kernel, lamb, (dataset.x, y), ridge_x) for y in dataset.y_samples])
    all_ridge_y = all_ridge_y.reshape(run_count, len(ridge_x))

    ridge_plot_img = build_img_src_from_plot(plot_ridge_regression(dataset, ridge_x, all_ridge_y[0]))
    mse_plot_img = build_img_src_from_plot(mse_plotter(data_process, ridge_x, all_ridge_y))

    return jsonify({'message': 'OK', 'ridge_plot': ridge_plot_img, 'mse_plot': mse_plot_img})


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

