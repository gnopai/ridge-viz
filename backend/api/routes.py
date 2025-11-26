from flask import Blueprint, jsonify
import numpy as np
from api.kernels import GaussianKernel
from api.data import make_fake_data
from api.util import build_img_src_from_plot
import api.ridge as ridge

api_blueprint = Blueprint("api", __name__)


@api_blueprint.route('/health')
def health():
    return jsonify({'message': 'OK'})


@api_blueprint.route('/ridge')
def ridge_regression():
    dataset = make_fake_data()
    n = len(dataset[0])
    kernel = GaussianKernel(variance = 1.0)
    lamb = 0.1
    ridge_x = np.linspace(0, n, 1000)
    ridge_y = ridge.ridge_regression(kernel, lamb, dataset, ridge_x)
    plot_ridge = lambda plt: plt.plot(dataset[0], dataset[1], 'b.', ridge_x, ridge_y, '-r')
    image_src = build_img_src_from_plot(plot_ridge)
    return jsonify({'message': 'OK', 'img_src': image_src})
