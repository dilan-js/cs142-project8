import React from "react";
import {
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Grid,
} from "@material-ui/core";

import "./LoginRegister.css";

import axios from "axios";
/**
 * Define TopBar, a React componment of CS142 project #5
 */
class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRegistering: false,
      credentials: {
        login_name: "",
        password: "",
        first_name: "",
        last_name: "",
        description: "",
        occupation: "",
        location: "",
      },
      errorMessage: "",
      confirmPassword: "",
      errorMessagePassword: "",
    };

    this.registerOrLogin = this.registerOrLogin.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  updateState(e) {
    let update = Object.assign({}, this.state.credentials);
    update[e.target.name] = e.target.value;
    this.setState({ credentials: update });
  }

  registerOrLogin(e) {
    e.preventDefault();
    let endpoint = "/admin/login";
    if (this.state.isRegistering) {
      if (this.state.credentials.password === this.state.confirmPassword) {
        endpoint = "/user";
      } else {
        this.setState({ errorMessagePassword: "The passwords do not match!" });
        return;
      }
    }

    axios
      .post(endpoint, this.state.credentials)
      .then((res) => {
        this.props.globalLogin(res.data);
        //navigate to home page
        alert("Success!");
        this.props.history.push("/");
      })
      .catch((error) => {
        this.setState({ errorMessage: error.response.data.msg });
      });
  }

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.registerOrLogin}>
          <Grid container spacing={4} justify="space-between">
            <Grid item xs={6}>
              <TextField
                required
                label="Login Name"
                name="login_name"
                value={this.state.credentials.login_name}
                onChange={this.updateState}
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label="Password"
                name="password"
                type="password"
                onChange={this.updateState}
                style={{ width: "100%" }}
              />
            </Grid>

            <Typography variant="body2">
              {this.state.isRegistering ? "" : this.state.errorMessage}
            </Typography>
            {this.state.isRegistering && (
              <React.Fragment>
                <Grid item xs={6}>
                  <TextField
                    required
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    onChange={(e) =>
                      this.setState({ confirmPassword: e.target.value })
                    }
                    style={{ width: "100%" }}
                    error={
                      this.state.confirmPassword !==
                      this.state.credentials.password
                    }
                  />
                </Grid>

                <Grid item>
                  <TextField
                    required
                    label="First Name"
                    name="first_name"
                    value={this.state.credentials.first_name}
                    onChange={this.updateState}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    label="Last Name"
                    name="last_name"
                    value={this.state.credentials.last_name}
                    onChange={this.updateState}
                    style={{ width: "100%" }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    label="Location"
                    name="location"
                    value={this.state.credentials.location}
                    onChange={this.updateState}
                    style={{ width: "100%" }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    label="Occupation"
                    name="occupation"
                    value={this.state.credentials.occupation}
                    onChange={this.updateState}
                    style={{ width: "100%" }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    required
                    label="Description"
                    name="description"
                    value={this.state.credentials.description}
                    onChange={this.updateState}
                    style={{ width: "100%" }}
                  />
                </Grid>
                <Typography variant="body2">
                  {this.state.errorMessagePassword}
                </Typography>
              </React.Fragment>
            )}
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <Button variant="contained" color="primary" type="submit">
                {this.state.isRegistering ? "Register me" : "Login"}
              </Button>
            </Grid>
            <Grid item>
              <FormControlLabel
                label="Register"
                control={
                  <Switch
                    checked={this.state.isRegistering}
                    onChange={(e) =>
                      this.setState({ isRegistering: e.target.checked })
                    }
                    name="loginRegisterSwitch"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  ></Switch>
                }
              ></FormControlLabel>
            </Grid>
          </Grid>
        </form>
      </React.Fragment>
    );
  }
}

export default LoginRegister;
