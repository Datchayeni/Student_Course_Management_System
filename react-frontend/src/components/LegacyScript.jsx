import { useEffect } from "react";

function LegacyScript({
    src,
    module = false
}) {

    useEffect(() => {

        const script =
            document.createElement("script");

        script.src = src;
        script.async = false;

        if (module) {
            script.type = "module";
        }

        document.body.appendChild(script);

        return () => {

            document.body.removeChild(script);

        };

    }, [src, module]);

    return null;
}

export default LegacyScript;