import { GameEvent } from "../../eazax-ccc/core/GameEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {

    @property(cc.Node)
    private mask: cc.Node = null;

    @property(cc.Node)
    private startBtn: cc.Node = null;

    @property(cc.Node)
    private restartBtn: cc.Node = null;

    protected onLoad() {
        this.startBtn.on('touchend', this.onStartBtnClick, this);
        this.restartBtn.on('touchend', this.onRestartBtnClick, this);
        GameEvent.on('gameinit', this.onGameInit, this);
        GameEvent.on('snakedie', this.onSnakeDie, this);
    }

    protected onDestroy() {
        this.startBtn.off('touchend', this.onStartBtnClick, this);
        this.restartBtn.off('touchend', this.onRestartBtnClick, this);
        GameEvent.off('gameinit', this.onGameInit, this);
        GameEvent.off('snakedie', this.onSnakeDie, this);
    }

    private onGameInit() {
        this.mask.active = true;
        this.startBtn.active = true;
        this.restartBtn.active = false;
    }

    private onSnakeDie() {
        this.mask.active = true;
        this.startBtn.active = false;
        this.restartBtn.active = true;
    }

    private startGame() {
        this.mask.active = false;
        this.startBtn.active = false;
        this.restartBtn.active = false;

        GameEvent.emit('gamestart');
    }

    private onStartBtnClick() {
        this.startGame();
    }

    private onRestartBtnClick() {
        this.startGame();
    }
}
