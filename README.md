# 3h-event

> A well-typed event emitter.

## Links

- [Documentation](https://github.com/huang2002/3h-event/wiki)
- [Changelog](./CHANGELOG)
- [License (MIT)](./LICENSE)

## Example

```ts
import { Event, EventEmitter } from '3h-event';

const EVENT_B = Symbol('name of event b');

type EventA = Event<'name_of_event_a', DataTypeOfEventA>;
type EventB = Event<EVENT_B, DataTypeOfEventB>;
type MyEvent = EventA | EventB;

const eventEmitter = new EventEmitter<MyEvent>();

eventEmitter.on('name_of_event_a', (event) => {
    event.stop();
    // ...
});

eventEmitter.on(EVENT_B, (event) => {
    event.cancel();
    // ...
});

const eventA: EventA = new Event({
    name: 'name_of_event_a',
    data: dataA,
    stoppable: true,
});

eventEmitter.emit(eventA);

if (eventA.stopped) {
    // ...
}

const eventB: EventB = new Event({
    name: EVENT_B,
    data: dataB,
    cancelable: true,
});

eventEmitter.emit(eventB);

if (eventB.canceled) {
    // ...
}
```
