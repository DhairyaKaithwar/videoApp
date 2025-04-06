const asyncHadele = (fn) => (req, res, next) => {
  fn(req, res, next).then;
};

const asyncHadeler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

export { asyncHadeler };
