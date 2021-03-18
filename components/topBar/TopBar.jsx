import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  FormControlLabel,
  Switch,
  Button,
  Grid,
} from "@material-ui/core";

import { Link } from "react-router-dom";
import "./TopBar.css";

import axios from "axios";
/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: "",
      userId: "",
      versionNumber: "",
      user: null,
    };
    this.readRouteAndUserId = this.readRouteAndUserId.bind(this);
  }

  async readRouteAndUserId() {
    let userIdFromURL = this.props.location.pathname.split("/");
    this.setState({ route: userIdFromURL[1], userId: userIdFromURL[2] });
    try {
      const { data } = await axios.get("/test/info");
      this.setState({ versionNumber: data.version });
    } catch (error) {
      console.log(error);
    }
    try {
      if (
        this.state.userId &&
        (this.state.route === "users" ||
          this.state.route === "photos" ||
          this.state.route === "comments")
      ) {
        const user = await axios.get("/user/" + this.state.userId);
        this.setState({ user: user.data });
      }
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.readRouteAndUserId();
  }

  componentDidUpdate(prevState) {
    if (prevState.location.pathname !== this.props.location.pathname) {
      this.readRouteAndUserId();
    }
  }

  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar className="cs142-topbar-toolbar">
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Link className="cs142-topBar-left-link" to="/" replace>
                <Typography className="cs142-topbar-nameTitle">
                  {`Dilan Nana v${this.state.versionNumber}.0`}
                </Typography>
              </Link>
            </Grid>
            <Grid item style={{ paddingTop: 15 }}>
              <FormControlLabel
                label="Extra Credit"
                control={
                  <Switch
                    checked={this.props.extraCredit}
                    onChange={(e) => this.props.handleExtraCreditToggle(e)}
                    name="extraCreditSwitch"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  ></Switch>
                }
              ></FormControlLabel>
            </Grid>
            <Grid item xs>
              <Typography variant={"h5"} className="cs142-top-mainTitle">
                {this.props.user === null
                  ? "Please Login"
                  : `Hi ${this.props.user.first_name}!`}
              </Typography>
            </Grid>

            <Grid item style={{ paddingTop: 15 }}>
              <Button
                onClick={() => this.props.logOut(this.props.history)}
                variant="contained"
              >
                Log Out
              </Button>
            </Grid>

            <Grid item style={{ paddingTop: 15 }}>
              <Link to="/uploadPhoto">
                <Button variant="contained">Upload Photo</Button>
              </Link>
            </Grid>
            <Grid item>
              <Typography style={{ paddingTop: 15 }} color="inherit">
                {this.state.route === "photos" && this.props.user
                  ? `Photos of `
                  : null}
                {this.state.route === "comments" && this.props.user
                  ? `Comments by `
                  : null}
                {this.state.user && this.state.route !== ""
                  ? `${this.state.user.first_name} ${this.state.user.last_name}`
                  : null}
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
