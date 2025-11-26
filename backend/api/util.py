import numpy as np
import base64
from io import BytesIO
from matplotlib.figure import Figure


def fix_data_dimension(data):
    if len(data.shape) > 1:
        return data

    return data[:, None]


def build_img_src_from_plot(plot_function):
    figure = Figure()
    plt = figure.subplots()

    # call the function that does the actual plotting
    plot_function(plt)

    buffer = BytesIO()
    figure.savefig(buffer, format="png")
    data = base64.b64encode(buffer.getbuffer()).decode("ascii")
    return f"data:image/png;base64,{data}"
