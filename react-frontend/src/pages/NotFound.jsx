import { Link } from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";


function NotFound() {

    return (
        <>
            <PageCss href="/css/Stylesheet.css" />

            <PageShell variant="public">

                <div className="container py-5 text-center">

                    <h1 className="display-1 fw-bold">
                        404
                    </h1>

                    <p className="lead">
                        Page not found.
                    </p>

                    <Link
                        to="/"
                        className="btn btn-primary"
                    >
                        Back to Home
                    </Link>

                </div>

            </PageShell>
        </>
    );
}


export default NotFound;
