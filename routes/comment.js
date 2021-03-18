const router = require("express").Router();
const photoController = require("../controllers/photoController");
const session = require("../middleware/session");
/*
 * URL /comment/user/:id - Returns all comments by User (id)
 */
router.get(
  "/comment/user/:id",
  session.requiresLogin,
  async function (request, response) {
    var id = request.params.id;
    const photos = await photoController.getAllCommentsByUser(id);
    if (photos === null) {
      response.status(400).json({ msg: "No comments found!" });
    }
    response.json(photos);
  }
);

/*
 * URL /commentsOfPhoto/:photo_id - Returns the photo on which the user commented.
 */
router.post(
  "/commentsOfPhoto/:photo_id",
  session.requiresLogin,
  async function (request, response, next) {
    if (request.body.comment.length === 0) {
      response
        .status(400)
        .json({ msg: "No comment made. Please type in a comment." })
        .end();
      next();
    }
    const photo = await photoController.addComment(request.params.photo_id, {
      comment: request.body.comment,
      user_id: request.session.user._id,
    });
    if (photo === null) {
      response
        .status(400)
        .json({ msg: "No photo found. Comment could not be added." });
    }
    response.json(await photoController.get(request.params.photo_id));
  }
);

module.exports = router;
