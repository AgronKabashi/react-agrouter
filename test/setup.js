import { configure } from "enzyme";
import { JSDOM } from "jsdom";
import Adapter from "enzyme-adapter-react-16";

const jsdom = new JSDOM("<!doctype html><html><body></body></html>");
const { window } = jsdom;

global.window = window;
global.document = window.document;

before(() => configure({ adapter: new Adapter() }));
