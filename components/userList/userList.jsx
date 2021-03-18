import React from "react";
import { Divider, List, ListItem, ListItemText } from "@material-ui/core";

import { Link } from "react-router-dom";

import axios from "axios";
import "./userList.css";

/**
 * Define UserList, a React componment of CS142 project #5
 */

class UserList extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   usersArray: [],
    // };
    // this.retrievedUsers = this.retrievedUsers.bind(this);
  }

  // async retrievedUsers() {
  //   try {
  //     const { data } = await axios.get("/user/getAllUserInfo");
  //     this.setState({ usersArray: data });
  //   } catch (error) {
  //     console.log(error);
  //     this.props.logOut();
  //   }
  // }

  // componentDidUpdate(prevState) {
  //   if (prevState.update !== this.props.update) {
  //     this.retrievedUsers();
  //   }
  // }

  render() {
    return (
      <div>
        <div className="cs142-userList-users-title">Users</div>
        <List component="nav">
          {this.props.users.length > 0 &&
            this.props.users.map((item) => (
              <div key={item._id}>
                <ListItem>
                  <ListItemText>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                      }}
                    >
                      <Link
                        to={"/users/" + item._id}
                        className="cs142-userList-link"
                      >
                        <span style={{ flex: "1 auto", width: "80%" }}>
                          {item.first_name + " " + item.last_name}
                        </span>
                      </Link>
                      {this.props.extraCredit && (
                        <React.Fragment>
                          <span
                            style={{
                              width: "25px",
                              height: "25px",
                              borderRadius: "50%",
                              backgroundColor: "#04c42b",
                              textAlign: "center",
                              lineHeight: "160%",
                            }}
                          >
                            {item.info.numPhotos}
                          </span>
                          <Link
                            to={"/comments/" + item._id}
                            style={{
                              width: "25px",
                              height: "25px",
                              borderRadius: "50%",
                              backgroundColor: "#c70616",
                              textAlign: "center",
                              lineHeight: "160%",
                              textDecoration: "none",
                              color: "#FFFFFF",
                            }}
                          >
                            <span>{item.info.numComments}</span>
                          </Link>
                        </React.Fragment>
                      )}
                    </div>
                  </ListItemText>
                </ListItem>
                <Divider />
              </div>
            ))}
        </List>
      </div>
    );
  }
}

export default UserList;
