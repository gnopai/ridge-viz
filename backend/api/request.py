from flask import request, abort, make_response
from werkzeug.exceptions import BadRequest
import numpy as np
from api.kernels import createKernel, getKernelConfigs

# TODO rename this file to run_config.py (it's only used by routes.py)


class RunConfig:
    def __init__(self, lamb, runs, kernel, kernel_name, kernel_param, kernel_param_value):
        self.lamb = lamb
        self.kernel = kernel
        self.runs = runs
        self.kernel_name = kernel_name
        self.kernel_param = kernel_param
        self.kernel_param_value = kernel_param_value


    @staticmethod
    def from_dict(obj):
        lamb = obj.get('lambda')
        runs = obj.get('runs')
        kernel_name = obj.get('kernelName')
        kernel_param = obj.get('kernelParamName')
        kernel_param_value = obj.get('kernelParamValue')

        kernel_params = {}
        if kernel_param and kernel_param_value is not None:
            kernel_params = { kernel_param: kernel_param_value }

        kernel = createKernel(kernel_name, **kernel_params)

        return RunConfig(lamb, runs, kernel, kernel_name, kernel_param, kernel_param_value)


    def as_dict(self):
        return {'lambda': self.lamb, 'runs': self.runs, 'kernelName': self.kernel_name,
                'kernelParamName': self.kernel_param, 'kernelParamValue': self.kernel_param_value}


def get_run_configs(body):
    try:
        return [RunConfig.from_dict(config) for config in body.get('configs')]
    except:
        raise BadRequest('Invalid kernel and/or parameters specified')
