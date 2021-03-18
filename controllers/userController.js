const User = require("../schema/user");
const functions = require("../utils/globalFunctions");
const Photo = require("../schema/photo");

const userController = {
  //this function returns all the users
  async all() {
    var userList = JSON.parse(JSON.stringify(await User.find()));
    userList.forEach((user, i) => {
      userList[i] = functions.minimalUser(functions.sanitizeData(user));
    });
    return userList;
  },

  //this function returns user information about #of comment and photos.
  async info(userId) {
    const userInfo = {
      userId: userId,
      numPhotos: 0,
      numComments: 0,
    };
    var photos = await Photo.find();
    photos.forEach((photo) => {
      if (photo.user_id.toString() === userId) {
        userInfo.numPhotos++;
      }
      photo.comments.forEach((comment) => {
        if (comment.user_id.toString() === userId) {
          userInfo.numComments++;
        }
      });
    });
    return userInfo;
  },

  //this function returns the cleaned data about a specific user.
  async get(userId) {
    var user = await User.findById(userId);
    if (user !== null) {
      return functions.sanitizeData(user);
    }
    return null;
  },

  //this function creates a user
  async create(credentials) {
    try {
      return await User.create(credentials);
    } catch (error) {
      return false;
    }
  },

  //this function facilitates logging a user in
  async login(credentials) {
    const user = await User.findOne({ login_name: credentials.login_name });
    if (!user) {
      return false;
    }
    var isPasswordCorrect = false;
    if (credentials.password === user.password) {
      isPasswordCorrect = true;
    }
    if (!isPasswordCorrect) {
      return false;
    }
    return this.get(user._id);
  },

  async findUser(searchTerm) {
    const pattern = `^${searchTerm}`;
    const regex = new RegExp(pattern, "i");
    console.log("THIS IS PATTERN: ", pattern);
    return await User.find({
      login_name: regex,
    });
  },
};

module.exports = userController;
