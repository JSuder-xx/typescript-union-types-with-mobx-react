export const secondsPerMinute = 60;
export const msPerSecond = 1000;
export const msPerMinute = secondsPerMinute * msPerSecond;

export function minutesElapsed({ currentTime, startTime }: {
    currentTime: Date;
    startTime: Date;
}) {    
    const [currentMs, startMs] = [currentTime, startTime].map(it => it.getTime());
    if (currentMs < startMs)
        throw new Error("Current time precedes start time!!!");
    return (currentMs - startMs) / msPerMinute;
}
