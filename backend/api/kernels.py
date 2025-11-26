import numpy as np


class GaussianKernel:
    def __init__(self, variance = 1.0):
        self.variance = variance

    def compute(self, x, y):
        return np.exp((-(x - y.T)**2) / (2 * self.variance))


class LinearKernel:
    def compute(self, x, y):
        return np.dot(x, y.T)


class PowerNKernel:
    def __init__(self, power = 1):
        self.power = power

    def compute(self, x, y):
        return (np.dot(x, y.T) + 1) ** power
