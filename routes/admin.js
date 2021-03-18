const router = require("express").Router();
const session = require("../middleware/session");
const userController = require("../controllers/userController");
const User = require("../schema/user");
/*
 * URL /login - logs the user in.
 */
router.post("/login", async function (request, response) {
  const verifiedLoginName = await User.findOne({
    login_name: request.body.login_name,
  });
  if (!verifiedLoginName) {
    return response
      .status(400)
      .json({ msg: "Incorrect login name. Try again" });
  }

  const verifiedPassword = await User.findOne({
    password: request.body.password,
  });
  if (!verifiedPassword) {
    return response.status(400).json({ msg: "Incorrect password. Try again." });
  }

  const user = await userController.login(request.body);
  if (!user) {
    return response.status(401).json({ msg: "Login failed" });
  }
  session.assign(request.session, user);
  response.json(user);
});

/*
 * URL /logout - logs the user out
 */
router.post("/logout", async function (request, response, next) {
  if (!request.session.user) {
    response.status(401).json({ msg: "Logout failed" }).end();
    next();
  } else {
    //empty the session
    request.session.destroy((err) => {
      if (err) {
        response.status(401).json({ msg: "Logout failed" }).end();
        next();
      } else {
        response.json({ msg: "Successfully logged out." });
      }
    });
  }
});

module.exports = router;
