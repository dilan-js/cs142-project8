import React from "react";
import { Typography, Button } from "@material-ui/core";
import "./userDetail.css";

import { Link } from "react-router-dom";

import axios from "axios";

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      specificPhotos: [],
    };
    this.getUserDetail = this.getUserDetail.bind(this);
    this.convertDate = this.convertDate.bind(this);
  }

  async getUserDetail(userId) {
    try {
      const { data } = await axios.get("/user/" + userId);
      this.setState({ user: data });
      console.log("Here");
      const response = await axios.get("/getMostRecentPopularPhoto/" + userId);
      console.log(response);
      this.setState({ specificPhotos: response.data });
    } catch (error) {
      console.log(error);
    }
  }
  componentDidMount() {
    this.getUserDetail(this.props.match.params.userId);
  }
  componentDidUpdate(prevState) {
    if (prevState.location.pathname !== this.props.location.pathname) {
      this.getUserDetail(this.props.match.params.userId);
    }
  }

  convertDate() {
    const date = new Date(
      this.state.specificPhotos.mostRecentPhoto.photo.date_time
    );
    return date.toLocaleString();
  }

  render() {
    console.log(this.state.specificPhotos);
    if (this.state.user === null) {
      return <h1>No User Found!</h1>;
    } else {
      return (
        <div>
          <Typography variant="h4">
            {this.state.user.first_name} {this.state.user.last_name}
          </Typography>
          <Typography variant="subtitle1">
            Occupation: {this.state.user.occupation} <br />
            Location: {this.state.user.location}
          </Typography>
          <Typography variant="body1">
            Description: {this.state.user.description}
          </Typography>
          <div className="cs142-userDetail-buttonDiv">
            <Link
              className="cs142-userDetail-linkStyle"
              to={"/photos/" + this.props.match.params.userId}
            >
              <Button variant="contained" color="primary">
                View Photos
              </Button>
            </Link>
          </div>
          <div>
            {this.state.specificPhotos.mostPopularPhoto ? (
              <Link
                style={{ textDecoration: "none", color: "black" }}
                to={
                  "/photoDetailView/" +
                  this.state.specificPhotos.mostPopularPhoto.photo._id
                }
              >
                <p>Most Popular Photo: </p>
                <img
                  style={{ width: 300 }}
                  src={`./images/${this.state.specificPhotos.mostPopularPhoto.photo.file_name}`}
                />
                <p>
                  {`${this.state.specificPhotos.mostPopularPhoto.photo.comments.length} comments`}
                </p>
              </Link>
            ) : null}
            {this.state.specificPhotos.mostRecentPhoto ? (
              <Link
                style={{ textDecoration: "none", color: "black" }}
                to={
                  "/photoDetailView/" +
                  this.state.specificPhotos.mostRecentPhoto.photo._id
                }
              >
                <p>Most Recent Photo: </p>

                <img
                  style={{ width: 300 }}
                  src={`./images/${this.state.specificPhotos.mostRecentPhoto.photo.file_name}`}
                />
                <p>{`Posted on ${this.convertDate()}`}</p>
              </Link>
            ) : null}
          </div>
        </div>
      );
    }
  }
}

export default UserDetail;
