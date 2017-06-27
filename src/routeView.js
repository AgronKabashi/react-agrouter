import React from "react";
import PropTypes from "prop-types";

export class RouteView extends React.Component {
  getChildContext () {
    return {
      routeIndex: this.context.routeIndex + 1
    };
  }

  componentDidMount () {
    this.context.subscribe(this, () => {
      this.setState({
        id: Date.now()
      });
    });
  }

  componentWillUnmount () {
    this.context.unsubscribe(this);
  }

  render () {
    const { children } = this.props;
    const { getRouteContent, routeIndex } = this.context;
    const component = getRouteContent(routeIndex);

    return <div>
      RouteView {routeIndex} - {Date.now()}
      {component ? component : <div>{children}</div>}
    </div>;
  }
}

RouteView.contextTypes = {
  subscribe: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
  getRouteContent: PropTypes.func.isRequired,
  routeIndex: PropTypes.number
};

RouteView.propTypes = {
  children: PropTypes.array
};
