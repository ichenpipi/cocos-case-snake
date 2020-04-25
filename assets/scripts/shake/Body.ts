const { ccclass, property } = cc._decorator;

@ccclass
export default class Body extends cc.Component {

    @property({ type: Body, tooltip: '下一节身体' })
    protected nextBody: Body = null;

    protected lastPos: cc.Vec2 = null; // 上一个位置

    /**
     * 设置下一节身体
     * @param body 节点
     */
    public setNextBody(body: Body) {
        this.nextBody = body;
        body.node.setPosition(this.lastPos);
    }

    /**
     * 移动该节点
     * 同时让下一个节点（如果有的话）移动到该节点之前的位置
     * @param nextPos 目标位置
     */
    public move(nextPos: cc.Vec2) {
        // 保存当前位置
        this.lastPos = this.node.getPosition();
        // 自身移动到新的位置
        this.node.setPosition(nextPos);
        // 让下一个节点移动到之前的位置
        if (this.nextBody) this.nextBody.move(this.lastPos);
    }

}
