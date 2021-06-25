import { BrowserRouter as Router, Route } from "react-router-dom";
import { Switch } from "react-router";

import "./sass/main.scss";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Dev from "./pages/Dev";

function App() {
	return (
		<div className="App">
			<Router>
				<Switch>
					<Route exact path="/" component={Home} />

					<Route path="/game" component={Game} />

					<Route path="/dev" component={Dev} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
