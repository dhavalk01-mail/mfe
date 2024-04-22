const errorFunction = (errorBit, msg, data) => {
    if (errorBit) return { is_error: errorBit, message: msg, error:data };
    else return { is_error: errorBit, message: msg, data };
};

module.exports = errorFunction;