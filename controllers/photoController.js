const User = require("../schema/user");
const functions = require("../utils/globalFunctions");
const Photo = require("../schema/photo");

const photoController = {
  //"preparePhoto" and "preparePhotos" are functions that clean data.
  async preparePhoto(photo) {
    photo = functions.sanitizeData(photo);
    for (var j = 0; j < photo.comments.length; j++) {
      const user = await User.findById(photo.comments[j].user_id);
      photo.comments[j].user = functions.minimalUser(
        functions.sanitizeData(user)
      );
      delete photo.comments[j].user_id;
    }
    return photo;
  },

  async preparePhotos(photos) {
    for (var i = 0; i < photos.length; i++) {
      photos[i] = await this.preparePhoto(photos[i]);
    }
    return photos;
  },

  //This function returns photos by the specific user
  async byUser(userId) {
    let photos = await Photo.find({ user_id: userId });
    return await this.preparePhotos(photos);
  },

  //This function returns cleaned data for a specific photo
  async get(photoId) {
    let specificPhoto = await Photo.find({ _id: photoId });
    return await this.preparePhotos(specificPhoto);
  },

  //This function returns comments the include all comments made by a specific user.
  async getAllCommentsByUser(userId) {
    var photos = await Photo.find()
      .where("comments.user_id")
      .equals(userId);
    return photos;
  },

  //This function facilitates commenting; returns the photo on which the user commented.
  async addComment(photo_id, commentInfo) {
    const foundPhoto = await Photo.findOne({ _id: photo_id });
    if (foundPhoto) {
      foundPhoto.comments.push(commentInfo);
      await foundPhoto.save();
      return foundPhoto;
    } else {
      return null;
    }
  },

  //This function adds a photo to the database and returns the photo.
  async addPhoto(path, userId) {
    return await Photo.create({ file_name: path, user_id: userId });
  },

  async getRecentAndPopularPhotos(userId) {
    const photos = await Photo.find({ user_id: userId });
    let specificPhotos = {
      mostRecentPhoto: { id: 0, createdAt: 0, photo: {} },
      mostPopularPhoto: { id: 0, numComments: 0, photo: {} },
    };
    photos.forEach((photo) => {
      const createdAt = new Date(photo.date_time);
      const numComments = photo.comments.length;
      if (createdAt.getTime() > specificPhotos.mostRecentPhoto.createdAt) {
        specificPhotos.mostRecentPhoto.id = photo._id;
        specificPhotos.mostRecentPhoto.createdAt = createdAt.getTime();
        specificPhotos.mostRecentPhoto.photo = photo;
      }
      if (numComments > specificPhotos.mostPopularPhoto.numComments) {
        specificPhotos.mostPopularPhoto.id = photo._id;
        specificPhotos.mostPopularPhoto.numComments = numComments;
        specificPhotos.mostPopularPhoto.photo = photo;
      }
    });
    if (specificPhotos.mostRecentPhoto.id === 0) {
      delete specificPhotos.mostRecentPhoto;
    }
    if (specificPhotos.mostPopularPhoto.id === 0) {
      delete specificPhotos.mostPopularPhoto;
    }

    return specificPhotos;
  },
  async addTag(photoId, tag) {
    return await Photo.update({ _id: photoId }, { $push: { tags: tag } });
  },
};

module.exports = photoController;
