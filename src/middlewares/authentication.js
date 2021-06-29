class AuthenticationMiddleware {
  constructor(authenticationService) {
    this.authenticationService = authenticationService;
  }

  middleware() {
    return (req, res, next) => {
      const jwtToken = req.cookies.token;
      if (!jwtToken) {
        return res.status(401).json({ error: "Unauthorized to call this API" });
      }
      try {
        const user_id = this.authenticationService.validateJwt(jwtToken);
        req.user_id = user_id;
        return next();
      } catch (e) {
        return res.status(401).json({ error: "Unauthorized to call this API" });
      }
    };
  }
}

module.exports = {
  AuthenticationMiddleware,
};
