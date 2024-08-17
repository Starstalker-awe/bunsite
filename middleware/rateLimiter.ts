export default class RateLimiter {
    private state: {[ip: string]: number} = {};
    // Numbers here are derived straight from my ass
    private MAX_REQUESTS: number = 150;
    private TIMEFRAME = 15;
    private intervalID: Timer;

    constructor() { this.intervalID = this.run()};
    private run() { return this.intervalID = setInterval(() => this.state = {}, this.TIMEFRAME * 1000)};

    public accepted(ip: string | undefined = "") {
        this.state[ip] ??= 0;
        return ++this.state[ip] < this.MAX_REQUESTS;
    };

    public freeze() { clearInterval(this.intervalID)};
    public restart() { this.run()};
};