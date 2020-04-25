import Body from "./Body";
import PoolManager from "../manager/PoolManager";
import { GameEvent } from "../../eazax-ccc/core/GameEvent";

const { ccclass, property } = cc._decorator;

export enum Direction {
    Up = 1, // 上
    Down, // 下
    Left, // 左
    Right // 右
}

@ccclass
export default class Head extends Body {

    private timer: number = 0; // 计时器

    private moveInterval: number = 0.2; // 移动间隔

    private moveDistance: number = 20; // 移动距离

    private bodys: Body[] = []; // 身体节点集合

    private curDirection: Direction = Direction.Up; // 下次移动的方向
    private nextDirection: Direction = Direction.Up; // 下次移动的方向

    private isAlive: boolean = false; // 是否活着

    private static instance: Head = null;

    public static get pos() { return this.instance.node.getPosition(); }

    protected onLoad() {
        Head.instance = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        GameEvent.on('gameinit', this.onGameInit, this);
        GameEvent.on('gamestart', this.onGameStart, this);
    }

    protected onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        GameEvent.off('gameinit', this.onGameInit, this);
        GameEvent.off('gamestart', this.onGameStart, this);
    }

    protected update(dt: number) {
        if (!this.isAlive) return;

        this.timer += dt;
        if (this.timer >= this.moveInterval) {
            this.timer -= this.moveInterval;
            // 移动到下一个位置
            switch (this.nextDirection) {
                case Direction.Up:
                    this.curDirection = Direction.Up;
                    this.move(cc.v2(this.node.x, this.node.y + this.moveDistance));
                    break;
                case Direction.Down:
                    this.curDirection = Direction.Down;
                    this.move(cc.v2(this.node.x, this.node.y - this.moveDistance));
                    break;
                case Direction.Left:
                    this.curDirection = Direction.Left;
                    this.move(cc.v2(this.node.x - this.moveDistance, this.node.y));
                    break;
                case Direction.Right:
                    this.curDirection = Direction.Right;
                    this.move(cc.v2(this.node.x + this.moveDistance, this.node.y));
                    break;
            }
        }
    }

    /**
     * 初始化
     */
    private onGameInit() {
        this.isAlive = false;
        this.node.setPosition(0, 0);
        this.nextDirection = Direction.Up;
        for (let i = 0; i < this.bodys.length; i++) {
            PoolManager.put(this.bodys[i].node);
        }
        this.bodys = [];
        this.nextNode = null;
    }

    /**
     * 动起来
     */
    private onGameStart() {
        this.onGameInit();
        this.isAlive = true;
    }

    /**
     * 吃吃吃，长长长
     */
    private eat(food: cc.Node) {
        cc.log('eat');
        PoolManager.put(food);

        GameEvent.emit('snakeeat');

        let node = PoolManager.get('body');
        node.setParent(this.node.parent);

        let body = node.getComponent(Body);
        if (this.bodys.length > 0) this.bodys[this.bodys.length - 1].setNextNode(body);
        else this.setNextNode(body);
        this.bodys.push(body);
    }

    /**
     * GG
     */
    private die() {
        cc.log('GG');
        this.isAlive = false;
        GameEvent.emit('snakedie');
    }

    /**
     * 键盘回调
     * @param event 
     */
    private onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.up:
                if (this.curDirection !== Direction.Down) this.nextDirection = Direction.Up;
                break;
            case cc.macro.KEY.down:
                if (this.curDirection !== Direction.Up) this.nextDirection = Direction.Down;
                break;
            case cc.macro.KEY.left:
                if (this.curDirection !== Direction.Right) this.nextDirection = Direction.Left;
                break;
            case cc.macro.KEY.right:
                if (this.curDirection !== Direction.Left) this.nextDirection = Direction.Right;
                break;
        }
    }

    protected onCollisionEnter(other: cc.BoxCollider, self: cc.BoxCollider) {
        switch (other.node.name) {
            case 'food':
                this.eat(other.node);
                break;
            case 'body':
            case 'border':
                this.die();
                break;
        }
    }
}
