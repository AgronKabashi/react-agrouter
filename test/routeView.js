import React from "react";
import PropTypes from "prop-types";
import { mount } from "enzyme";
import sinon from "sinon";
import { RouteView } from "../src/routeView";

const { assert } = sinon;

function setup (context, children) {
  class Root extends React.Component {
    getChildContext () {
      return context;
    }

    render () {
      return <RouteView>{children}</RouteView>;
    }
  }

  Root.childContextTypes = {
    getRouteContent: PropTypes.func,
    unsubscribe: PropTypes.func,
    subscribe: PropTypes.func,
    navigateTo: PropTypes.func,
    routeIndex: PropTypes.number
  };

  return mount(<Root />);
}

describe("RouteView", () => {
  let context;
  let wrapper;
  const subscribe = () => {};

  beforeEach(() => {
    context = {
      routeIndex: 0,
      subscribe: sinon.spy(subscribe),
      unsubscribe: sinon.spy(),
      getRouteContent: sinon.spy(() => "content")
    };

    wrapper = setup(context);
  });

  afterEach(() => wrapper.unmount());

  it("subscribes for events when mounted", () => {
    assert.calledOnce(context.subscribe);
    assert.notCalled(context.unsubscribe);
  });

  it("unsubscribes for events when unmounted", () => {
    wrapper.unmount();
    assert.calledOnce(context.unsubscribe);
  });

  it("calls getRouteContent to fetch it's content", () => {
    assert.calledOnce(context.getRouteContent);
    assert.calledWith(context.getRouteContent, context.routeIndex);
    !context.getRouteContent.returned("content") && assert.fail("Fail");
  });

  it("does not render the children if route content is available", () => {
    wrapper = setup(context, <div className="inner"></div>);
    wrapper.find(".inner").length !== 0 && assert.fail("Fail");
  });

  it("renders the children if no route content is available", () => {
    context.getRouteContent = sinon.spy();
    wrapper = setup(context, <div className="inner"></div>);
    wrapper.find(".inner").length === 0 && assert.fail("Fail");
  });
});
