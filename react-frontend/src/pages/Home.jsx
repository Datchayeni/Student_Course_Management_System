import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";

function Home() {

    return (
        <>
            <PageCss href="/css/Stylesheet.css" />

            <PageShell variant="student">

                <section className="hero">

                    <div className="hero-content">

                        <h1>
                            Student Course Management System
                        </h1>

                        <p>
                            Learn new skills, explore courses,
                            track your progress and build your knowledge.
                        </p>

                        <div className="hero-buttons">

                            <a href="/login">
                                Login
                            </a>

                            <a href="/register">
                                Register
                            </a>

                        </div>

                    </div>

                </section>

            </PageShell>
        </>
    );
}

export default Home;