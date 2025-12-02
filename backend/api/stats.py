import numpy as np


def overall_mse(data_process, x, y):
    actual_y = data_process.means(x)
    return np.mean(np.pow(actual_y - y, 2))


def mse_plotter(data_process, ridge_x, ridge_y):
    means = np.array([np.mean(y) for y in ridge_y.T])
    variances = np.array([np.var(y, ddof=1) for y in ridge_y.T])
    actual_means = data_process.means(ridge_x)
    squared_biases = np.pow(means - actual_means, 2)
    mses = squared_biases + variances

    def make_mse_plot(plt):
        plt.plot(ridge_x, mses, '-r', ridge_x, variances, '-g', ridge_x, squared_biases, '-b')

    return make_mse_plot
