class Response {
  constructor(res) {
    this.RESPOSNE = res;
  }

  internalError() {
    return this.RESPONSE.status(500).json({
      is_sucess: false,
      message: "Internal server error!",
    });
  }

  success(message) {
  return   this.RESPONSE.status(200).json({
      is_success: true,
      message: message,
    });
  }
}

module.exports = Response;
