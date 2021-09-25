
export interface Node {
    value: any;
    next: Node | null;
};

export class LinkedList {
    
    private nodes: Node[];
    
    constructor() {
        this.nodes = [];
    };
    get size(): number {
        return this.nodes.length;
    };
    get head(): Node | null {
        return this.size ? this.nodes[0] : null;
    };
    get tail(): Node | null {
        return this.size ? this.nodes[this.size - 1] : null;
    };
    insertAt(index: number, value: any): void {
        const previousNode: Node = this.nodes[index - 1] || null;
        const nextNode: Node = this.nodes[index] || null;
        const node: Node = {
            value,
            next: nextNode,
        };
        if (previousNode) previousNode.next = node;
        this.nodes.splice(index, 0, node);
    };
    insertFirst(value: any): void {
        this.insertAt(0, value);
    };
    insertLast(value: any): void {
        this.insertAt(this.size, value);
    };
    getAt(index: number): Node {
        return this.nodes[index];
    };
    removeAt(index: number): Node[] {
        const previousNode: Node = this.nodes[index - 1];
        const nextNode: Node = this.nodes[index + 1] || null;
        if (previousNode) previousNode.next = nextNode;
        return this.nodes.splice(index, 1);
    };
    clear(): void {
        this.nodes = [];
    };
    reverse(): void {
        this.nodes = this.nodes.reduce(
            (acc: Node[], { value }: Node) => [
                {
                    value,
                    next: acc[0] || null,
                },
                ...acc,
            ],
            []
        );
    };
    *[Symbol.iterator]() {
        yield* this.nodes;
    };
};