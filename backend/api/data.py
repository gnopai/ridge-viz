import numpy as np
from scipy.stats import norm


# this makes a winding 1d data set of 256 points
def make_fake_data():
    normal_means = [0, 3, 7, 4, 0, -3, -9, -5, 2, 4, 11, 18, 15, 13, 10, 4, 0]
    data = [norm.rvs(mean, 3, 15) for mean in normal_means]
    y = np.concat(data)
    x = np.arange(0, len(y))
    return (x, y)
        

