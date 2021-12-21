import React, { Component } from "react";
import { Redirect } from "react-router-dom";

export default function withRedirect(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        redirect: null,
      };
    }

    componentDidUpdate() {
      if (this.state.redirect != null) {
        this.setState({
          redirect: null,
        });
      }
    }

    setRedirect = (redirect) => {
      this.setState({
        redirect: redirect,
      });
    };

    render() {
      if (this.state.redirect) {
        return <Redirect to={this.state.redirect} />;
      }

      return (
        <WrappedComponent setRedirect={this.setRedirect} {...this.props} />
      );
    }
  };
}
