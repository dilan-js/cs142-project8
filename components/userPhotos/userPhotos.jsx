import React from "react";
import { Typography } from "@material-ui/core";
import "./userPhotos.css";

import { Link } from "react-router-dom";

import axios from "axios";

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userPhotos: [],
    };
    this.getUserPhotos = this.getUserPhotos.bind(this);
    this.getUserPhotos(this.props.match.params.userId);
  }

  async getUserPhotos(userId) {
    try {
      const { data } = await axios.get("/photosOfUser/" + userId);
      this.setState({ userPhotos: data });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    if (this.state.userPhotos.length === 0) {
      return <h1>There are no photos!</h1>;
    } else {
      return (
        <div>
          {this.state.userPhotos.map((photo) => (
            <React.Fragment key={photo._id}>
              <Link to={`/photoDetailView/${photo._id}`}>
                <img
                  className="cs142-userPhotos-photo"
                  src={"/images/" + photo.file_name}
                  alt={photo.file_name}
                ></img>
              </Link>
              <Typography variant="h6">
                Date & Time : {photo.date_time}
              </Typography>
              <div>
                <Typography variant="h6">Comments:</Typography>
                {photo.comments.length > 0 ? (
                  photo.comments.map((comment) => (
                    <div key={comment._id}>
                      <Typography>
                        Author:{" "}
                        <Link to={"/users/" + comment.user._id}>
                          {comment.user.first_name}
                        </Link>
                      </Typography>
                      <Typography>Posted: {comment.date_time}</Typography>
                      <Typography>Comment: {comment.comment}</Typography>
                    </div>
                  ))
                ) : (
                  <Typography>No comments!</Typography>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      );
    }
  }
}

export default UserPhotos;
