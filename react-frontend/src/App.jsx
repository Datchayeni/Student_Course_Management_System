import {
    Routes,
    Route
} from "react-router-dom";

import Home from "./pages/Home";


function NotFound() {

    return (
        <div>

            <h1>
                404
            </h1>

            <p>
                Page not found.
            </p>

        </div>
    );
}


function App() {

    return (

        <Routes>

            {/* HOME */}

            <Route
                path="/"
                element={<Home />}
            />


            {/* 404 */}

            <Route
                path="*"
                element={<NotFound />}
            />

        </Routes>

    );
}


export default App;