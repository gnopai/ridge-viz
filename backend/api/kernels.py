import numpy as np
import sys
import inspect

this_module = sys.modules[__name__]

# There's some hacky reflection set up to register kernels automatically, so make sure that:
# 1) all kernel names end in "Kernel"
# 2) only use a single (optional) constructor param with a default value set

class GaussianKernel:
    def __init__(self, variance = 1.0):
        self.variance = variance

    def compute(self, x, y):
        return np.exp((-(x - y.T)**2) / (2 * self.variance))


class SincKernel:
    def __init__(self, a = 1/np.pi):
        self.a = a

    def compute(self, x, y):
        return np.sinc(self.a * (x - y.T)**2)


class LinearKernel:
    def compute(self, x, y):
        return np.dot(x, y.T)


class PowerKernelBase:
    def __init__(self, power):
        self.power = power

    def compute(self, x, y):
        return (np.dot(x, y.T) + 1) ** self.power


class AffineKernel(PowerKernelBase):
    def __init__(self):
        super().__init__(1)


class QuadraticKernel(PowerKernelBase):
    def __init__(self):
        super().__init__(2)


class CubicKernel(PowerKernelBase):
    def __init__(self):
        super().__init__(3)


def createKernel(name, **kwargs):
    cls = globals().get(name)
    if cls is None:
        raise ValueError('Unknown kernel requested!')

    return cls(**kwargs)


def _extractConfigForKernelClass(obj):
    className, cls = obj
    if not className.endswith('Kernel'):
        return None

    paramName = None
    paramDefault = None

    # Assume single parameters for now with defaults set
    for name, param, in inspect.signature(cls.__init__).parameters.items():
        if name != 'self' and param.default is not inspect.Parameter.empty:
            paramName = name
            paramDefault = param.default

    return { 'name': className, 'paramName': paramName, 'paramValue': paramDefault }


def getKernelConfigs():
    kernelClasses = inspect.getmembers(this_module, inspect.isclass)
    configs = [_extractConfigForKernelClass(cls) for cls in kernelClasses]
    return [config for config in configs if config is not None]

