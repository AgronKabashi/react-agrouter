import React from "react";
import PropTypes from "prop-types";
import { createRouter } from "agrouter";
import { RouteView } from "./routeView";

const defaultRouteComponents = [];

export class Router extends React.Component {
  constructor (...args) {
    super(...args);

    this.routeViewSubscribers = new Map();
  }

  getChildContext () {
    const { getRouteContent, navigateTo, subscribe, unsubscribe } = this;
    return {
      getRouteContent,
      subscribe,
      unsubscribe,
      navigateTo,
      routeIndex: 0
    };
  }

  componentWillMount () {
    this.router = createRouter(this.props.routes);
    window.addEventListener("popstate", this.onLocationChange, false);
  }

  componentDidMount () {
    this.navigateTo(document.location.pathname, false);
  }

  getRouteContent = routeIndex => {
    return (this.state.routeComponents || defaultRouteComponents)[routeIndex];
  }

  subscribe = (reference, callback) => {
    this.routeViewSubscribers.set(reference, callback);
  }

  unsubscribe = reference => {
    this.routeViewSubscribers.delete(reference);
  }

  navigateTo = (pathname, pushState = true) => {
    const { actionPayloads = [], pathParts } = this.router.navigate(pathname, pushState);
    const routeComponents = actionPayloads.filter(data => React.isValidElement(data));

    this.setState({
      actionPayloads,
      pathParts,
      routeComponents
    }, () => this.routeViewSubscribers.forEach(subscriber => subscriber()));
  }

  componentWillUnmount () {
    window.removeEventListener("popstate", this.onLocationChange, false);
  }

  onLocationChange = ({ state }) => {
    this.navigateTo(document.location.pathname, false);
  }

  render () {
    return <RouteView />;
  }
}

Router.childContextTypes = {
  getRouteContent: PropTypes.func,
  subscribe: PropTypes.func,
  navigateTo: PropTypes.func,
  routeIndex: PropTypes.number
};

Router.propTypes = {
  routes: PropTypes.object.isRequired
};
