from flask import Blueprint, jsonify, request, abort, make_response
from werkzeug.exceptions import HTTPException
import numpy as np
from api.kernels import createKernel, getKernelConfigs
from api.data import default_gaussian_process
from api.util import build_img_src_from_plot
from api.stats import mse_plotter, overall_mse
from api.ridge import ridge_plotter, RidgeModel
from api.ridge_config import get_ridge_configs

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
    ridge_configs = get_ridge_configs(body)

    data_process = default_gaussian_process
    dataset = data_process.sample(np.arange(255), ridge_configs[0].runs)
    n = dataset.length()

    ridge_x = np.linspace(0, n, 1000)
    ridge_results = [_run_single_config(config, dataset, data_process, ridge_x) for config in ridge_configs]

    return jsonify({'message': 'OK', 'results': ridge_results})


def _run_single_config(config, dataset, data_process, ridge_x):
    ridge_models = [RidgeModel(config.kernel, config.lamb, dataset.x, y) for y in dataset.y_samples]
    all_ridge_y = np.array([model.predict(ridge_x) for model in ridge_models])
    all_ridge_y = all_ridge_y.reshape(config.runs, len(ridge_x))

    ridge_plot_img = build_img_src_from_plot(ridge_plotter(dataset, ridge_x, all_ridge_y[0]))
    mse_plot_img = build_img_src_from_plot(mse_plotter(data_process, ridge_x, all_ridge_y))

    response = config.as_dict()
    response['ridgePlot'] = ridge_plot_img
    response['msePlot'] = mse_plot_img
    response['overallMSE'] = overall_mse(data_process, ridge_x, all_ridge_y[0])
    return response
    

@api_blueprint.errorhandler(HTTPException)
def handle_exception(e):
    body = jsonify({'error': e.name, 'message': e.description})
    return make_response(body, e.code)
