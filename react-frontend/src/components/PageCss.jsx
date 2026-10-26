import { useEffect } from "react";


/*
 * Loads one of the page stylesheets in /public/css.
 *
 * student.css, admin.css and Stylesheet.css all restyle the same
 * class names (.card, .navbar, .sidebar...), so only the stylesheet
 * for the current page may be active.
 *
 * The <link> is created once and then switched on/off with
 * `disabled`. Removing and re-adding it on every navigation made
 * each page flash unstyled while the file was fetched again.
 */
function PageCss({ href }) {

    useEffect(() => {

        let link =
            document.querySelector(
                `link[data-page-css="${href}"]`
            );

        if (!link) {

            link = document.createElement("link");

            link.rel = "stylesheet";
            link.href = href;
            link.dataset.pageCss = href;

            document.head.appendChild(link);
        }

        link.disabled = false;

        return () => {

            link.disabled = true;
        };

    }, [href]);

    return null;
}

export default PageCss;
