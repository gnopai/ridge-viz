from flask import Blueprint, jsonify, request, abort, make_response
from werkzeug.exceptions import HTTPException
import numpy as np
from api.kernels import createKernel, getKernelConfigs
from api.data import default_gaussian_process
from api.util import build_img_src_from_plot
from api.stats import mse_plotter, overall_mse
from api.ridge import RidgePlotter, RidgeModel
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
    
    ridge_plotter = RidgePlotter(dataset, data_process, ridge_x, all_ridge_y)
    full_ridge_plot = build_img_src_from_plot(ridge_plotter.make_full_plot)
    process_ridge_plot = build_img_src_from_plot(ridge_plotter.make_process_plot)
    model_ridge_plot = build_img_src_from_plot(ridge_plotter.make_model_plot)
    samples_ridge_plot = build_img_src_from_plot(ridge_plotter.make_samples_plot)
    mse_plot_img = build_img_src_from_plot(mse_plotter(data_process, ridge_x, all_ridge_y))

    response = config.as_dict()
    response['ridgeFullPlot'] = full_ridge_plot
    response['ridgeProcessPlot'] = process_ridge_plot
    response['ridgeModelPlot'] = model_ridge_plot
    response['ridgeSamplesPlot'] = samples_ridge_plot
    response['msePlot'] = mse_plot_img
    response['overallMSE'] = overall_mse(data_process, ridge_x, all_ridge_y[0])
    return response
    

@api_blueprint.errorhandler(HTTPException)
def handle_exception(e):
    body = jsonify({'error': e.name, 'message': e.description})
    return make_response(body, e.code)
