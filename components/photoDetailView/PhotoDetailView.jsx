import React from "react";
import { Typography, Button, TextField } from "@material-ui/core";

import { Link } from "react-router-dom";
import Annotation from "react-image-annotation";
import TagUserSearch from "../TagUserSearch/TagUserSearch";
import axios from "axios";

/**
 * Define PhotoDetailView, a React componment of CS142 project #5
 */
class PhotoDetailView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userPhotos: [],
      addedComment: "",
      errorMessage: "",
      annotations: [],
      annotation: {},
    };
    this.getPhotoById = this.getPhotoById.bind(this);
    this.addComment = this.addComment.bind(this);
    this.updateState = this.updateState.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange = (annotation) => {
    console.log("ONCHANEG: ", annotation);
    this.setState({ annotation });
  };
  //referenced the docs for this
  onSubmit = (annotation) => {
    const { geometry, data } = annotation;

    this.setState({
      annotation: {},
      annotations: this.state.annotations.concat({
        geometry,
        data: {
          ...data,
          id: Math.random(),
        },
      }),
    });
  };

  async getPhotoById(photoId) {
    try {
      const { data } = await axios.get("/photo/" + photoId);
      this.setState({ userPhotos: data });
    } catch (error) {
      console.log(error);
    }
  }

  updateState(e) {
    this.setState({ addedComment: e.target.value });
  }

  async addComment() {
    try {
      const { data } = await axios.post(
        "/commentsOfPhoto/" + this.props.match.params.photoId,
        {
          comment: this.state.addedComment,
        }
      );
      this.setState({ errorMessage: "" });
      this.setState({ userPhotos: data });
    } catch (error) {
      this.setState({ errorMessage: error.response.data.msg });
    }
  }

  componentDidMount() {
    this.getPhotoById(this.props.match.params.photoId);
  }

  render() {
    if (this.state.userPhotos.length === 0) {
      return <h1>There are no photos!</h1>;
    } else {
      return (
        <div>
          {this.state.userPhotos.map((photo) => (
            <React.Fragment key={photo._id}>
              <Annotation
                src={"/images/" + photo.file_name}
                alt="Two pebbles anthropomorphized holding hands"
                renderEditor={(renderProps) => (
                  <TagUserSearch
                    users={this.props.users}
                    photoId={photo._id}
                    {...renderProps}
                  />
                )}
                annotations={this.state.annotations}
                type="RECTANGLE"
                value={this.state.annotation}
                onChange={this.onChange}
                onSubmit={this.onSubmit}
              />

              {/* <img
                className="cs142-userPhotos-photo"
                src={"/images/" + photo.file_name}
                alt={photo.file_name}
              ></img> */}
              <Typography variant="h6">
                Date & Time : {photo.date_time}
              </Typography>
              <div>
                <Typography variant="h6">Comments:</Typography>
                <TextField
                  multiline
                  onChange={this.updateState}
                  resize="false"
                ></TextField>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.addComment}
                >
                  Add Comment
                </Button>
                <Typography>{this.state.errorMessage}</Typography>
                {photo.comments ? (
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
                  <Typography>No comments</Typography>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      );
    }
  }
}

export default PhotoDetailView;
