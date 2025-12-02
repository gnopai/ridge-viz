from flask import request, abort, make_response
from werkzeug.exceptions import BadRequest
import numpy as np
from api.kernels import createKernel, getKernelConfigs


class RunConfig:
    def __init__(self, lamb, kernel, runs):
        self.lamb = lamb
        self.kernel = kernel
        self.runs = runs


def get_run_configs(body):
    try:
        runs = body.get('runs', 5)
        lambdas = body.get('lambdas')
        request_kernels = body.get('kernels', [])
        kernels = [_parse_kernel(kernel) for kernel in request_kernels]
        return [RunConfig(lamb, kernel, runs) for lamb in lambdas for kernel in kernels]
    except:
        raise BadRequest('Invalid kernel and/or parameters specified')


def _parse_kernel(kernel):
    name = kernel.get('name')
    param = kernel.get('paramName')
    param_value = kernel.get('paramValue')

    kernel_params = {}
    if param and param_value is not None:
        kernel_params = { param: param_value }

    return createKernel(name, **kernel_params)
