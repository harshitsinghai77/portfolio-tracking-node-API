module.exports = () => {
  //Check if req content type is application/json
  return (req, res, next) => {
    if (req.method == "POST") {
      if (req.is("json") || req.is("application/json")) {
        return next();
      } else {
        return res.json({
          error:
            "Request body Content-Type is not json. Request body should be in json format",
        });
      }
    }
    return next();
  };
};
