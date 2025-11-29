import numpy as np


def _calculate_alphas(kernel, lamb, data):
    K = kernel.compute(data[0], data[0])
    n = len(data[0])
    inverse = np.linalg.inv(K + n * lamb * np.identity(n))
    return np.linalg.matmul(inverse, data[1])


def _eval_single_point(kernel, x, data_xs, alphas):
    x_as_array = np.array([x])[:, None]
    return np.dot(kernel.compute(x_as_array, data_xs), alphas)


def ridge_regression(kernel, lamb, data, xs):
    alphas = _calculate_alphas(kernel, lamb, data)
    data_xs = data[0]
    return np.array([_eval_single_point(kernel, x, data_xs, alphas) for x in xs])
