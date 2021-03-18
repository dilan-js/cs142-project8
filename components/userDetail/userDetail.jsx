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
    };
    this.getUserDetail = this.getUserDetail.bind(this);
  }

  async getUserDetail(userId) {
    try {
      const { data } = await axios.get("/user/" + userId);
      this.setState({ user: data });
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

  render() {
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
        </div>
      );
    }
  }
}

export default UserDetail;
