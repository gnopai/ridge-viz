import numpy as np


class Dataset:
    def __init__(self, x, y_samples, actual_y):
        self.x = x
        self.y_samples = y_samples
        self.actual_y = actual_y


    def length(self):
        return len(self.x)


class SimpleGaussianProcess:
    def __init__(self, mean_func, var_func):
        self.mean_func = mean_func
        self.var_func = var_func

    def sample(self, xs, count):
        means = [self.mean_func(x) for x in xs]
        variances = [self.var_func(x) for x in xs]
        cov = np.diag(variances)
        return np.random.multivariate_normal(mean=means, cov=cov, size=count)


# TODO get mean/var arrays from args
def sample_gaussian_data(xs):
    mean_func = np.polynomial.Polynomial(np.array([0.5625, 0.546, -1.64e-2, 1.667e-4, -6.89e-7, 1e-9]))
    var_func = np.polynomial.Polynomial(np.array([2, 3.26e-2, -3.75e-4, 1e-6]))
    gp = SimpleGaussianProcess(mean_func, var_func)

    y_samples = gp.sample(xs, 100)
    actual_y = [mean_func(x) for x in xs]
    return Dataset(xs[:, None], y_samples, actual_y)
