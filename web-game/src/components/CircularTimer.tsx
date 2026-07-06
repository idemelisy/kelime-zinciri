type Props = {
    timeLeft: number;
    totalTime: number;
};

export default function CircularTimer({
    timeLeft,
    totalTime,
}: Props) {

    const radius = 42;
    const circumference = 2 * Math.PI * radius;

    const progress =
        (timeLeft / totalTime) * circumference;

    let color = "#4d6b5b";

    if (timeLeft <= 5)
        color = "#d9a441";

    if (timeLeft <= 3)
        color = "#d9534f";

    return (
        <div className="timer-wrapper">

            <svg
                className="timer-svg"
                width="110"
                height="110"
            >

                <circle
                    cx="55"
                    cy="55"
                    r={radius}
                    className="timer-bg"
                />

                <circle
                    cx="55"
                    cy="55"
                    r={radius}
                    className="timer-progress"
                    stroke={color}
                    strokeDasharray={circumference}
                    strokeDashoffset={
                        circumference - progress
                    }
                />

            </svg>

            <div className="timer-text">
                {timeLeft}
            </div>

        </div>
    );
}