
const { ccclass, property } = cc._decorator;

@ccclass
export default class PoolManager extends cc.Component {

    @property(cc.Prefab)
    private bodyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    private foodPrefab: cc.Prefab = null;

    private bodyPool: cc.NodePool = new cc.NodePool();
    private foodPool: cc.NodePool = new cc.NodePool();

    private static instance: PoolManager = null;

    onLoad() {
        PoolManager.instance = this;
    }

    public static get(name: string) {
        switch (name) {
            case 'body':
                if (this.instance.bodyPool.size() > 0) return this.instance.bodyPool.get();
                return cc.instantiate(this.instance.bodyPrefab);
            case 'food':
                if (this.instance.foodPool.size() > 0) return this.instance.foodPool.get();
                return cc.instantiate(this.instance.foodPrefab);
        }
    }

    public static put(node: cc.Node) {
        switch (node.name) {
            case 'body':
                if (this.instance.bodyPool.size() < 10) {
                    this.instance.bodyPool.put(node);
                    return;
                }
                break;
            case 'food':
                if (this.instance.foodPool.size() < 10) {
                    this.instance.foodPool.put(node);
                    return;
                }
                break;
        }
        node.destroy();
    }
}
