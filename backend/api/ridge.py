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


class RidgePlotter:
    def __init__(self, dataset, data_process, ridge_x, ridge_y):
        self.sample_data = dataset
        self.x = ridge_x
        self.ridge_y = ridge_y[0]

        self.real_y = data_process.means(ridge_x)
        self.real_sd = np.sqrt(data_process.variances(ridge_x))

        self.ridge_means = np.array([np.mean(y) for y in ridge_y.T])
        self.ridge_sd = np.sqrt(np.array([np.var(y, ddof=1) for y in ridge_y.T]))

    def make_full_plot(self, plt):
        self._plot_samples(plt)
        self._plot_model_run(plt)
        self._plot_process(plt)
        self._plot_model(plt)
        plt.legend()


    def make_process_plot(self, plt):
        self._plot_samples(plt)
        self._plot_process(plt)
        plt.legend()


    def make_model_plot(self, plt):
        self._plot_samples(plt)
        self._plot_model(plt)
        plt.legend()


    def make_samples_plot(self, plt):
        self._plot_samples(plt)
        self._plot_model_run(plt)
        plt.legend()


    def _plot_samples(self, plt):
        plt.plot(self.sample_data.x, self.sample_data.y_samples[0], 'b.', label='Sample data')


    def _plot_model_run(self, plt):
        plt.plot(self.x, self.ridge_y, 'r-', label='Single model run')


    def _plot_process(self, plt):
        plt.plot(self.x, self.real_y, 'g-', label='Real function')
        plt.plot(self.x, self.real_y - self.real_sd, 'c--', label='Real ± 1 SD')
        plt.plot(self.x, self.real_y + self.real_sd, 'c--')


    def _plot_model(self, plt):
        plt.plot(self.x, self.ridge_means, 'm-', label='Model avg')
        plt.plot(self.x, self.ridge_means - self.ridge_sd, 'y--', label='Model avg ± 1 SD')
        plt.plot(self.x, self.ridge_means + self.ridge_sd, 'y--')
