const router = require("express").Router();
const session = require("../middleware/session");
const photoController = require("../controllers/photoController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const uploadPath = path.join(__dirname, "../images/");
var upload = multer({ dest: uploadPath });

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
router.get(
  "/photosOfUser/:id",
  session.requiresLogin,
  session.parseUserId,
  async function(request, response) {
    let id = request.userId;
    const photos = await photoController.byUser(id);
    if (photos.length === 0) {
      response.status(401).json("Nothing found!");
      return;
    }

    response.status(200).json(photos);
  }
);

router.get(
  "/getMostRecentPopularPhoto/:id",
  session.requiresLogin,
  async function(request, response) {
    let id = request.params.id;
    const specificPhotos = await photoController.getRecentAndPopularPhotos(id);
    response.status(200).json(specificPhotos);
  }
);

/*
 * URL /photo/:photoId - Returns a specific photo by its id
 */
router.get("/photo/:photoId", session.requiresLogin, async function(
  request,
  response
) {
  let photoId = request.params.photoId;
  const specificPhoto = await photoController.get(photoId);
  if (specificPhoto === null) {
    response.status(400).json({ msg: "Nothing found!" });
    return;
  }
  response.status(200).json(specificPhoto);
});

router.post("/photo/:photoId/tags", session.requiresLogin, async function(
  request,
  response
) {
  const photoId = request.params.photoId;

  const specificPhoto = await photoController.get(photoId);
  if (specificPhoto === null) {
    response.status(400).json({ msg: "Nothing found!" });
    return;
  }
  // if (specificPhoto.tags) {
  //   specificPhoto.tags.push(request.body);
  // } else {
  //   specificPhoto.tags = [request.body];
  // }
  const savedSpecificPhoto = await photoController.addTag(
    photoId,
    request.body
  );
  response.status(200).json(savedSpecificPhoto);
});

/*
 * URL /photos/new - Returns the photo the user uploaded after saving it to the database
 */
router.post(
  "/photos/new",
  session.requiresLogin,
  upload.single("uploadedphoto"),
  async function(request, response, next) {
    if (!request.file) {
      response.status(400).json({ msg: "No file uploaded!" });
      next();
    }
    const fileEnding = request.file.mimetype.split("/");
    if (fileEnding[0] !== "image") {
      response
        .status(400)
        .json({ msg: "The uploaded file is not an image. Try again" });
    }
    const name = Date.now() + request.file.originalname + "." + fileEnding[1];

    fs.renameSync(uploadPath + request.file.filename, uploadPath + name);
    const uploadedPhoto = await photoController.addPhoto(
      name,
      request.session.user._id
    );
    response.json(uploadedPhoto);
  }
);

module.exports = router;
