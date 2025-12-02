import numpy as np


class RidgeModel:
    def __init__(self, kernel, lamb, train_x, train_y):
        self.kernel = kernel
        self.lamb = lamb
        self.train_x = train_x

        # do the fitting here
        K = self.kernel.compute(train_x, train_x)
        n = len(train_x)
        # TODO there's more efficient ways to do this
        inverse = np.linalg.inv(K + n * self.lamb * np.identity(n))
        self.alphas = np.linalg.matmul(inverse, train_y)


    def predict(self, xs):
        return np.array([self._predict_single(x) for x in xs])


    def _predict_single(self, x):
        x_as_array = np.array([x])[:, None]
        return np.dot(self.kernel.compute(x_as_array, self.train_x), self.alphas)



def ridge_plotter(dataset, ridge_x, ridge_y):
    def make_plot(plt):
        plt.plot(dataset.x, dataset.y_samples[0], 'b.', ridge_x, ridge_y, '-r')

    return make_plot

