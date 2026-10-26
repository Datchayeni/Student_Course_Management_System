/*
 * Bootstrap progress bar (styled further by the page CSS).
 */
function ProgressBar({
    value = 0,
    className = ""
}) {

    const percent =
        Math.max(0, Math.min(100, value));

    return (

        <div className={`progress ${className}`}>

            <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${percent}%` }}
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                {percent}%
            </div>

        </div>

    );
}

export default ProgressBar;
