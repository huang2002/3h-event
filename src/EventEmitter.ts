import { Event, EventName } from './Event';

export type SelectEvent<Events, Name extends EventName> =
    Extract<Events, Event<Name, any>>;
/** dts2md break */
export type EventListener<EventType extends Event = Event> = (event: EventType) => void;
/** dts2md break */
export interface ListenerRecord<EventType extends Event> {
    listener: EventListener<EventType>;
    once: boolean;
}
/** dts2md break */
export class EventEmitter<EventType extends Event = Event> {
    /** dts2md break */
    /**
     * eventName -> listenerRecords[]
     */
    readonly listenerMap: Map<EventType['name'], ListenerRecord<EventType>[]> = new Map();
    /** dts2md break */
    /**
     * Returns `true` if some listeners are triggered;
     * Returns `false` if there are no listeners.
     */
    emit(event: EventType) {
        const { listenerMap } = this;
        const { name } = event;
        let handled = false;
        if (listenerMap.has(name)) {
            const records = listenerMap.get(name)!;
            const remainingRecords = records.filter(record => {
                if (event.stopped) {
                    return true;
                }
                handled = true;
                record.listener(event);
                return !record.once;
            });
            listenerMap.set(name, remainingRecords);
        }
        return handled;
    }
    /** dts2md break */
    addListener<K extends EventType['name']>(
        eventName: K,
        listener: EventListener<SelectEvent<EventType, K>>,
        once = false,
    ) {
        const { listenerMap } = this;
        if (listenerMap.has(eventName)) {
            const records = listenerMap.get(eventName)! as ListenerRecord<SelectEvent<EventType, K>>[];
            records.push({ listener, once });
        } else {
            const record = { listener, once } as ListenerRecord<EventType>;
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
    once<K extends EventType['name']>(
        eventName: K,
        listener: EventListener<SelectEvent<EventType, K>>,
    ) {
        return this.addListener(eventName, listener, true);
    }
    /** dts2md break */
    removeListener<K extends EventType['name']>(
        eventName: K,
        listener: EventListener<SelectEvent<EventType, K>>,
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
