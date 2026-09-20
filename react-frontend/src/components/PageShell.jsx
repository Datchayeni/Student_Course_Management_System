import Navbar from "./Navbar";
import Footer from "./Footer";

function PageShell({
    children,
    variant = "student"
}) {

    return (
        <>

            <Navbar variant={variant} />

            <main>
                {children}
            </main>

            <Footer />

        </>
    );
}

export default PageShell;