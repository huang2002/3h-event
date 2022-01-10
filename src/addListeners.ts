import type { EventEmitter, EventListener, EventMap, ListenerRecord } from './EventEmitter';

/**
 * Map the given event type to a listener description dict.
 */
export type EventListeners<Events extends EventMap> = {
    [Name in keyof Events]: (
        | EventListener<Events[Name]>
        | ListenerRecord<Events[Name]>
    );
};
/** dts2md break */
/**
 * Add a few event listeners by providing a dict.
 * (eventName -> listener | listenerRecord)
 * @example
 * ```js
 * HEvent.addListeners(eventEmitter, {
 *     // provide a listener:
 *     foo: fooListener,
 *     // or a listener record:
 *     bar: {
 *         listener: barListener,
 *         once: true,
 *     },
 * });
 * ```
 */
export const addListeners = <Events extends EventMap>(
    target: EventEmitter<Events>,
    listeners: Partial<EventListeners<Events>>,
) => {

    let value;

    // strings
    (Object.getOwnPropertyNames(listeners) as (keyof Events)[])
        .forEach(name => {
            value = listeners[name]!;
            if (typeof value === 'function') {
                target.addListener(name, value);
            } else {
                target.addListener(name, value.listener, value.once);
            }
        });

    // symbols
    (Object.getOwnPropertySymbols(listeners) as (keyof Events)[])
        .forEach(symbol => {
            value = listeners[symbol]!;
            if (typeof value === 'function') {
                target.addListener(symbol, value);
            } else {
                target.addListener(symbol, value.listener, value.once);
            }
        });

};
