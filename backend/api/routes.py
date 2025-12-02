from flask import Blueprint, jsonify, request, abort, make_response
from werkzeug.exceptions import HTTPException
import numpy as np
from api.kernels import createKernel, getKernelConfigs
from api.data import default_gaussian_process
from api.util import build_img_src_from_plot
from api.stats import mse_plotter
from api.ridge import ridge_regression as do_ridge_reg, plot_ridge_regression
from api.request import get_run_configs

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
    run_configs = get_run_configs(body)
    first_config = run_configs[0]

    data_process = default_gaussian_process
    dataset = data_process.sample(np.arange(255), first_config.runs)
    n = dataset.length()

    ridge_x = np.linspace(0, n, 1000)
    all_ridge_y = np.array([do_ridge_reg(first_config.kernel, first_config.lamb, (dataset.x, y), ridge_x) for y in dataset.y_samples])
    all_ridge_y = all_ridge_y.reshape(first_config.runs, len(ridge_x))

    ridge_plot_img = build_img_src_from_plot(plot_ridge_regression(dataset, ridge_x, all_ridge_y[0]))
    mse_plot_img = build_img_src_from_plot(mse_plotter(data_process, ridge_x, all_ridge_y))

    return jsonify({'message': 'OK', 'ridge_plot': ridge_plot_img, 'mse_plot': mse_plot_img})


@api_blueprint.errorhandler(HTTPException)
def handle_exception(e):
    body = jsonify({'error': e.name, 'message': e.description})
    return make_response(body, e.code)
