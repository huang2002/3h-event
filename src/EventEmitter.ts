import { Event } from './Event';

/**
 * Type of event maps.
 */
export interface EventMap {
    [eventName: string]: Event;
}
/** dts2md break */
/**
 * Type of event listeners.
 */
export type EventListener<EventType extends Event = Event> = (event: EventType) => void;
/** dts2md break */
/**
 * Type of listener records.
 */
export interface ListenerRecord<EventType extends Event> {
    listener: EventListener<EventType>;
    once: boolean;
}
/** dts2md break */
/**
 * The class of event targets,
 * where `Events` specifies what kind of events
 * can be listened or emitted.
 */
export class EventEmitter<Events extends EventMap = EventMap> {
    /** dts2md break */
    /**
     * eventName -> listenerRecords[]
     */
    readonly listenerMap: Map<keyof Events, ListenerRecord<Events[keyof Events]>[]> = new Map();
    /** dts2md break */
    /**
     * Returns `true` if some listeners are triggered;
     * Returns `false` if there are no listeners.
     */
    emit(event: Events[keyof Events]) {
        const { listenerMap } = this;
        const name = event.name as keyof Events;
        let handled = false;
        if (listenerMap.has(name)) {
            const records = listenerMap.get(name)!;
            records.forEach(record => {
                if (event.stopped) {
                    return true;
                }
                handled = true;
                record.listener(event);
            });
            const _records = listenerMap.get(name);
            if (_records) {
                const remainingRecords = _records.filter(
                    record => (
                        !record.once
                        || !records.includes(record)
                    )
                );
                listenerMap.set(name, remainingRecords);
            }
        }
        return handled;
    }
    /** dts2md break */
    /**
     * Add a listener that listens on specific event.
     */
    addListener<K extends keyof Events>(
        eventName: K,
        listener: EventListener<Events[K]>,
        once = false,
    ) {
        const { listenerMap } = this;
        if (listenerMap.has(eventName)) {
            const records = listenerMap.get(eventName)! as ListenerRecord<Events[K]>[];
            records.push({ listener, once });
        } else {
            const record = { listener, once } as ListenerRecord<Events[keyof Events]>;
            listenerMap.set(eventName, [record]);
        }
        return this;
    }
    /** dts2md break */
    /**
     * Shortcut for `addListener`. (bound)
     */
    on = this.addListener.bind(this);
    /** dts2md break */
    /**
     * addListener(eventName, listener, true)
     */
    once<K extends keyof Events>(
        eventName: K,
        listener: EventListener<Events[K]>,
    ) {
        return this.addListener(eventName, listener, true);
    }
    /** dts2md break */
    /**
     * Remove a listener by passing the same arguments
     * that you passed to `addListener`.
     */
    removeListener<K extends keyof Events>(
        eventName: K,
        listener: EventListener<Events[K]>,
        once = false,
    ) {
        const { listenerMap } = this;
        if (listenerMap.has(eventName)) {
            const records = listenerMap.get(eventName)!;
            const filteredRecords = records.filter(
                record => ((record.listener !== listener) || (record.once !== once))
            );
            listenerMap.set(eventName, filteredRecords);
        }
        return this;
    }
    /** dts2md break */
    /**
     * Shortcut for `removeListener`. (bound)
     */
    off = this.removeListener.bind(this);

}
