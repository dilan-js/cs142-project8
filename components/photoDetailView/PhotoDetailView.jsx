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
      activate: false,
    };
    this.getPhotoById = this.getPhotoById.bind(this);
    this.addComment = this.addComment.bind(this);
    this.updateState = this.updateState.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange = (annotation) => {
    this.setState({ annotation });
  };
  //referenced the docs for this
  onSubmit = (annotation) => {
    const { geometry, data } = annotation;
    const user =
      this.props.users.find((user) => user._id === data.taggedUser) || {};
    const payload = {
      geometry,
      data: {
        taggedUser: data.taggedUser,
        id: Math.random(),
        text: `${user.first_name} ${user.last_name}`,
      },
    };

    console.log(payload);
    this.setState({
      annotation: {},
      annotations: this.state.annotations.concat(payload),
    });
    try {
      axios.post(`/photo/${data.photoId}/tags`, payload);
    } catch (error) {
      console.log(error);
    }
  };

  async getPhotoById(photoId) {
    try {
      const { data } = await axios.get("/photo/" + photoId);
      console.log(data);
      const annotations = data[0].tags.map((tag) => {
        const user =
          this.props.users.find((user) => user._id === tag.data.taggedUser) ||
          {};
        return {
          ...tag,
          data: {
            ...tag.data,
            text: `${user.first_name} ${user.last_name}`,
          },
        };
      });
      this.setState({ userPhotos: data, annotations });
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
    if (this.props.users.length > 0) {
      this.getPhotoById(this.props.match.params.photoId);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.users.length === 0 && this.props.users.length > 0) {
      this.getPhotoById(this.props.match.params.photoId);
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
                annotations={this.state.activate ? this.state.annotations : []}
                type="RECTANGLE"
                value={this.state.annotation}
                onChange={this.onChange}
                onSubmit={this.onSubmit}
                renderContent={({ annotation }) => {
                  console.log(annotation);
                  return (
                    <div
                      style={{
                        position: "absolute",
                        backgroundColor: "#FFFFFF",
                        fontSize: 30,
                        left: `${annotation.geometry.x +
                          annotation.geometry.width / 2}%`,
                        top: `${annotation.geometry.y}%`,
                      }}
                      key={annotation.text}
                    >
                      <Link to={"/users/" + annotation.data.taggedUser}>
                        {annotation.data.text}
                      </Link>
                    </div>
                  );
                }}
              />

              {/* <img
                className="cs142-userPhotos-photo"
                src={"/images/" + photo.file_name}
                alt={photo.file_name}
              ></img> */}
              <Button>Activate Annotations</Button>
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
