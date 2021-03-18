import React from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from "@material-ui/core";

import "./CommentView.css";

import { Link } from "react-router-dom";

import axios from "axios";

import { withStyles } from "@material-ui/core/styles";

/**
 * Define UserDetail, a React componment of CS142 project #5
 */

const dilanStyles = () => ({
  root: {
    backgroundPosition: "0 0",
  },
  cardBackground: {
    backgroundColor: "#F4f4f4",
    height: "100%",
  },
  linkStyle: {
    textDecoration: "none",
    color: "#000000",
  },
});

class CommentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      userId: null,
    };
    this.readUserDetailsFromURL = this.readUserDetailsFromURL.bind(this);
  }

  async readUserDetailsFromURL() {
    let userIdFromURL = this.props.location.pathname.split("/");
    if (userIdFromURL[2]) {
      this.setState({ userId: userIdFromURL[2] });
      const { data } = await axios.get("/comment/user/" + userIdFromURL[2]);
      this.setState({
        photos: data,
      });
    }
  }

  componentDidMount() {
    this.readUserDetailsFromURL();
  }

  componentDidUpdate(prevState) {
    if (prevState.location.pathname !== this.props.location.pathname) {
      this.readUserDetailsFromURL();
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Grid container spacing={3}>
          {this.state.photos.map((photo) =>
            photo.comments.map((comment) => (
              <React.Fragment key={comment._id}>
                {comment.user_id === this.state.userId ? (
                  <Grid item xs={3}>
                    <Card className={classes.cardBackground}>
                      <Link
                        className={classes.linkStyle}
                        to={"/photoDetailView/" + photo._id}
                      >
                        <CardMedia
                          component="img"
                          alt="Contemplative Reptile"
                          height="200"
                          image={"/images/" + photo.file_name}
                          title={photo.file_name}
                        />

                        <CardContent>
                          <Typography
                            variant="h6"
                            color="textSecondary"
                            component="h3"
                          >
                            {`"${comment.comment}"`}
                          </Typography>
                        </CardContent>
                      </Link>
                    </Card>
                  </Grid>
                ) : null}
              </React.Fragment>
            ))
          )}
        </Grid>
      </div>
    );
  }
}

export default withStyles(dilanStyles, { withTheme: true })(CommentView);
