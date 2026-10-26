import Navbar from "./Navbar";
import Footer from "./Footer";


/*
 * variant:
 *   "public"  - navbar with Login/Register + footer
 *   "student" - student navbar
 *   "bare"    - nothing around the page (login, register...)
 *   "admin"   - nothing around the page; the admin pages build
 *               their own container-fluid/sidebar layout with
 *               AdminSidebar, to match admin.css exactly.
 */
function PageShell({
    children,
    variant = "student"
}) {

    if (variant === "admin" || variant === "bare") {

        return <>{children}</>;
    }


    return (
        <>

            <Navbar variant={variant} />

            {children}

            {variant === "public" && <Footer />}

        </>
    );
}


export default PageShell;
