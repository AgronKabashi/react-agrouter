# react-agrouter
react-agrouter is a React/Preact routing library using agrouter.

### Installation
```
npm install react-agrouter --save
```

### Usage

Initializing the router
```jsx
import { Router } from "react-agrouter";
import routes from "./routes";

ReactDOM.render(<Provider store={store}>
  <Router routes={routes} />
</Provider>, document.body);
```

Using RouteView
```jsx
import { RouteView } from "react-agrouter";

// RouteViews are placeholder components.
// They will render route specific content returned
// from router actions or the default content inside of it
const HomeComponent = () => (
  <div>
    <h1>Home</h1>
    <RouteView>
      Default content for this component. Can be replaced with route specific content.
    <RouteView>
  </div>
);
```

```jsx
export default {
  "/": {
    action: () => <HomeComponent />,
    routes: {
      "detailed": () => <span>This will show inside a RouteView component if the parent has one</span>
    }
  }
};

// Expected output for uri "/"
//  <div>
//    <h1>Home</h1>
//    <div>
//      Default content for this component. Can be replaced with route specific content.
//    </div>
//  </div>
//
// Expected output for uri "/detailed"
//  <div>
//    <h1>Home</h1>
//    <span>This will show inside a RouteView component if the parent has one</span>
//  </div>
//
```

```jsx
// RouteViews can also be used in the route configuration
export default {
  "/": {
    action: () => <RouteView>Default content</RouteView>,
    routes: {
      "detailed": () => <span>This will show inside a RouteView component if the parent has one</span>
    }
  }
};
```

Using Links
```js
import { Link } from "react-agrouter";

const Navigation = () => (
  <nav>
    <Link to="/">Home</Link>
    <Link to="/about" className="active">About</Link>
  </nav>
);
```

### Versioning
This project uses semantic versioning.

### Licence
MIT