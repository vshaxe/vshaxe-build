class Run {
    static function main() {
        Sys.exit(Sys.command("node", ["run.js"].concat(Sys.args())));
    }
}