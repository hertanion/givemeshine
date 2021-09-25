
import { LinkedList } from '@shine-linkedlist';

export type NextMiddleware = () => unknown;
export type Handler = (data: any, next: NextMiddleware) => unknown;

export abstract class MiddlewareEventEmitter {

    private events = new Map();

    protected use(event: string, handler: Handler): this {
        if (!this.events.has(event)) this.events.set(event, new LinkedList());    
        this.events.get(event).insertLast(handler);
        return this;
    };

    protected emit(event: string, data: any) {
        if (!this.events.has(event)) return;
        let handler = this.events.get(event).head;
        async function next() {
            handler = handler.next;
            if (!handler) return Promise.resolve(undefined);
            try {
                return Promise.resolve(handler.value(data, next));
            } catch (e) {
                return Promise.reject(e);
            };
        };
        handler.value(data, next);
    };

    protected emitAll(events: string[], data: any) {
        events.map(event => this.emit(event, data));
    };

};