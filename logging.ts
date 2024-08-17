import loglevel from "loglevel";

loglevel.setLevel(Bun.env.RUN_BY !== "systemd" ? "info" : "silent");

export default function log(time: number, label: string) { loglevel.info(`\x1b[1m\x1b[90m[${time.toFixed(2)}ms]\t\x1b[0m\x1b[1m${label}`)};