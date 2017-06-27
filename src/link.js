import React from "react";
import PropTypes from "prop-types";

export class Link extends React.Component {
  onClick = e => {
    e.preventDefault();
    this.context.navigateTo(this.props.to);
  }

  render () {
    const { children, to } = this.props;
    return <a href={to} onClick={this.onClick}>{children}</a>;
  }
}

Link.contextTypes = {
  navigateTo: PropTypes.function
};

Link.propTypes = {
  children: PropTypes.array,
  to: PropTypes.string.isRequired
};
