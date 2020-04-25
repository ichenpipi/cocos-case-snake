import { GameEvent } from "../eazax-ccc/core/GameEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    protected onLoad() {
        cc.director.getCollisionManager().enabled = true;
    }

    protected start() {
        GameEvent.emit('gameinit');
    }
}
