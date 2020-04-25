import PoolManager from "./PoolManager";
import { GameEvent } from "../../eazax-ccc/core/GameEvent";
import Head from "../shake/Head";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FoodManager extends cc.Component {

    @property(cc.Node)
    private foodLayer: cc.Node = null;

    protected onLoad() {
        GameEvent.on('gameinit', this.onGameInit, this);
        GameEvent.on('gamestart', this.onGameStart, this);
        GameEvent.on('snakedie', this.onSnakeDie, this);
        GameEvent.on('snakeeat', this.onSnakeEat, this);
    }

    protected onDestroy() {
        GameEvent.off('gameinit', this.onGameInit, this);
        GameEvent.off('gamestart', this.onGameStart, this);
        GameEvent.off('snakedie', this.onSnakeDie, this);
        GameEvent.off('snakeeat', this.onSnakeEat, this);
    }

    private onGameInit() {
        this.foodLayer.destroyAllChildren();
    }

    private onGameStart() {
        this.foodLayer.destroyAllChildren();
        this.create();
    }

    private onSnakeEat() {
        this.create();
        // this.scheduleOnce(() => { this.create() }, 2);
    }

    private onSnakeDie() {
        // this.unscheduleAllCallbacks();
    }

    private create() {
        let node = PoolManager.get('food');
        node.setParent(this.foodLayer);
        let pos: cc.Vec2;
        pos = this.getRamdonPos();
        while (pos.x === Head.pos.x && pos.y === Head.pos.y) {
            pos = this.getRamdonPos();
        }
        node.setPosition(pos);
    }

    private getRamdonPos() {
        let xRange = this.foodLayer.width / 20;
        let yRange = this.foodLayer.height / 20;

        let x = -this.foodLayer.width / 2 + 10 + Math.floor(Math.random() * xRange) * 20;
        let y = -this.foodLayer.height / 2 + 10 + Math.floor(Math.random() * yRange) * 20;

        return cc.v2(x, y);
    }

}
