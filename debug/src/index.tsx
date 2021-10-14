import * as ReactDOM from "react-dom";
import App from "./app";

ReactDOM.render(<App />, document.getElementById("debug"));

if (module.hot) module.hot.accept();
