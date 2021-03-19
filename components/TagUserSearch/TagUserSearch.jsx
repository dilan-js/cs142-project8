/* File Description */

/* Local Imports */

/* Third Party Imports */
import React from "react";
import axios from "axios";

class TagUserSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      users: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //   handleOnChange(e) {
  //     this.setState({ text: e.target.value });
  //     axios
  //       .get("/user/find?login_name=" + this.state.text)
  //       .then((res) => this.setState({ users: [...res.data] }));
  //   }

  handleChange(e) {
    const payload = {
      ...this.props.annotation,
      data: { taggedUser: e.target.value, photoId: this.props.photoId },
    };
    this.props.onChange(payload);
  }

  handleSubmit(e) {
    const payload = {
      ...this.props.annotation,
      data: { taggedUser: e.target.value, photoId: this.props.photoId },
    };
    this.props.onSubmit(payload);
  }

  render() {
    console.log(this.props);
    return (
      <div style={styles.main}>
        <form onSubmit={this.handleSubmit}>
          <button type="submit">Save Tag</button>
          <select onChange={this.handleChange}>
            <option>Select User</option>
            {this.props.users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.first_name} {user.last_name}
              </option>
            ))}
          </select>
        </form>

        {/* <input value={this.state.text} onChange={this.handleOnChange} /> */}
      </div>
    );
  }
}
const styles = {
  main: {
    position: "absolute",
    bottom: -10,
    backgroundColor: "red",
  },
};
export default TagUserSearch;
