module.exports = () => {
  return (req, res, next) => {
    res.sendSuccess = function (responseObject = {}) {
      return this.status(200).json(responseObject);
    };

    res.sendResourceCreated = function (responseObject = {}) {
      return this.status(201).json(responseObject);
    };

    res.sendBadRequestError = function (responseObject = {}) {
      if (responseObject.isJoi) {
        // bad request generated by joi
        const errorMessage = responseObject.details[0].message;
        return this.status(400).json({
          success: false,
          message: errorMessage,
          data: null,
        });
      }
      return this.status(400).json(responseObject);
    };

    res.sendInternalServerError = function () {
      return this.status(500).json({
        success: false,
        message: "Internal server error",
        data: null,
      });
    };

    res.sendAlreadyExists = function (responseObject = {}) {
      return this.status(409).json(responseObject);
    };

    res.sendNotFound = function (responseObject = {}) {
      return this.status(404).json(responseObject);
    };

    next();
  };
};
