const success = (res, data = null, message = "success", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

const error = (res, message = "error", status = 400, code = null) => {
  const payload = {
    success: false,
    error: {
      message,
    },
  };

  if (code !== null) payload.error.code = code;

  return res.status(status).json(payload);
};

export default { success, error };
