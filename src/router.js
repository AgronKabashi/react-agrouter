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
    this.router = createRouter(this.props.routes, {
      history: window.history // TODO: Use agnostic history so we can do SSR
    });

    window.addEventListener("popstate", this.onLocationChange);
  }

  componentWillUnmount () {
    window.removeEventListener("popstate", this.onLocationChange);
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
    const deferedLoading = setTimeout(() => this.setState({ isLoading: true }));

    this.router.navigate(pathname, pushState) // eslint-disable-line promise/catch-or-return
      .then(({ uriSegments = [] }) => { // eslint-disable-line promise/always-return
        clearTimeout(deferedLoading);

        const routeComponents = uriSegments
          .filter(({ actionResult }) => React.isValidElement(actionResult))
          .map(({ actionResult }) => actionResult);

        this.setState({
          isLoading: false,
          uriSegments,
          routeComponents
        }, () => this.routeViewSubscribers.forEach(subscriber => subscriber()));
      });
  }

  onLocationChange = (/* { state } */) => {
    this.navigateTo(document.location.pathname, false);
  }

  render () {
    return <RouteView isLoading={this.state.isLoading} />;
  }
}

Router.childContextTypes = {
  getRouteContent: PropTypes.func,
  unsubscribe: PropTypes.func,
  subscribe: PropTypes.func,
  navigateTo: PropTypes.func,
  routeIndex: PropTypes.number
};

Router.propTypes = {
  routes: PropTypes.object.isRequired
};
