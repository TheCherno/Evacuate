var game;

function start() {
    game = new Game(960, 540);
    game.init();
    window.setInterval(run, 1000 / 60);
}

function run() {
    game.run();
}