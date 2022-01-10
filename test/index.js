// @ts-check
const { test } = require('3h-test');
const HEvent = /** @type {import('..')} */(
    /** @type {unknown} */(require('../dist/3h-event.umd.js'))
);

const { Event, EventEmitter } = HEvent;

test(null, {

    timeStamp(context) {

        context.assert(Math.abs(Event.getTimeStamp() - Date.now()) <= 1);

        const timeStamp0 = Date.now();
        const event0 = new Event({ name: 'test', data: null });
        context.assert(Math.abs(event0.timeStamp - timeStamp0) <= 1);

        const timeStamp1 = 1011;
        const event1 = new Event({ name: 'test', data: null, timeStamp: timeStamp1 });
        context.assert(Math.abs(event1.timeStamp - timeStamp1) <= 1);

    },

    basics(context) {

        const EVENT_C = Symbol('event c');

        /**
         * @typedef {HEvent.Event<'a', number>} EventA
         * @typedef {HEvent.Event<'b', { x: number; }>} EventB
         * @typedef {HEvent.Event<EVENT_C, null>} EventC
         */

        /**
         * @typedef {{ a: EventA; b: EventB; [EVENT_C]: EventC; }} Events
         */

        /**
         * @type {HEvent.EventEmitter<Events>}
         */
        const eventEmitter = new EventEmitter();
        let logs = [];

        /**
         * @param {EventA} event
         */
        const listenerA = event => {
            event.data * 2; // assert: event.data is a number
            logs.push(event);
        };

        eventEmitter.addListener('a', listenerA);
        eventEmitter.addListener('a', listenerA, true);

        eventEmitter.removeListener('a', listenerA);

        eventEmitter.addListener('b', event => {
            context.assertStrictEqual(typeof event.timeStamp, 'number');
            logs.push(event);
        });

        eventEmitter.addListener('b', event => { logs.push(event); }, true);
        eventEmitter.once('b', event => { logs.push(event); });

        /**
         * @param {EventC} event
         */
        const listenerC = event => { logs.push(event); };

        eventEmitter.on(EVENT_C, listenerC);
        eventEmitter.on(EVENT_C, listenerC, true);

        eventEmitter.off(EVENT_C, listenerC, true);

        // @ts-expect-error
        eventEmitter.on('undefined', () => { });

        /**
         * @param {number} data
         * @returns {EventA}
         */
        const createEventA = (data) => (
            /** @type {EventA} */(
                new Event(
                    () => ({ name: 'a', data })
                )
            )
        );

        /**
         * @param {number} x
         * @returns {EventB}
         */
        const createEventB = (x) => (
            new Event({ name: 'b', data: { x } })
        );

        /**
         * @returns {EventC}
         */
        const createEventC = () => (
            new Event({ name: EVENT_C, data: null })
        );

        const eventA0 = createEventA(0);
        const eventA1 = createEventA(1);
        const eventB0 = createEventB(0);
        const eventB1 = createEventB(1);
        const eventC0 = createEventC();
        const eventC1 = createEventC();

        context.assertStrictEqual(eventEmitter.emit(eventA0), true);
        context.assertStrictEqual(eventEmitter.emit(eventB0), true);
        context.assertStrictEqual(eventEmitter.emit(eventA1), false);
        context.assertStrictEqual(eventEmitter.emit(eventB1), true);
        context.assertStrictEqual(eventEmitter.emit(eventC0), true);
        context.assertStrictEqual(eventEmitter.emit(eventC1), true);

        context.assertShallowEqual(logs, [
            eventA0,
            eventB0,
            eventB0,
            eventB0,
            eventB1,
            eventC0,
            eventC1,
        ]);

    },

    stop(context) {

        /**
         * @typedef {HEvent.Event<'x', null>} EventX
         * @typedef {HEvent.Event<'y', null>} EventY
         */

        /**
         * @type {HEvent.EventEmitter<{ x: EventX; y: EventY; }>}
         */
        const eventEmitter = new EventEmitter();

        /**
         * @type {EventX}
         */
        const eventX = new Event({ name: 'x', data: null, stoppable: true });

        /**
         * @type {EventY}
         */
        const eventY = new Event({ name: 'y', data: null });

        let log = '';

        context.assertStrictEqual(eventX.stoppable, true);
        context.assertStrictEqual(eventX.stopped, false);
        context.assertStrictEqual(eventY.stoppable, false);
        context.assertStrictEqual(eventY.stopped, false);

        eventEmitter.on('x', (event) => {
            context.assertStrictEqual(event.stopped, false);
            log += 'a';
        });

        eventEmitter.on('x', (event) => {
            event.stop();
            log += 'b';
        });

        eventEmitter.on('x', () => {
            log += 'c';
        });

        eventEmitter.on('y', (event) => {
            context.assertStrictEqual(event.stopped, false);
            log += '0';
        });

        eventEmitter.on('y', (event) => {
            event.stop();
            log += '1';
        });

        eventEmitter.emit(eventX);
        context.assertStrictEqual(eventX.stopped, true);

        eventEmitter.emit(eventY);
        context.assertStrictEqual(eventY.stopped, false);

        context.assertStrictEqual(log, 'ab01');

    },

    cancel(context) {

        /**
         * @typedef {HEvent.Event<'x', null>} EventX
         * @typedef {HEvent.Event<'y', null>} EventY
         */

        /**
         * @type {HEvent.EventEmitter<{ x: EventX; y: EventY; }>}
         */
        const eventEmitter = new EventEmitter();

        /**
         * @type {EventX}
         */
        const eventX = new Event({ name: 'x', data: null, cancelable: true });

        /**
         * @type {EventY}
         */
        const eventY = new Event({ name: 'y', data: null });

        let log = '';

        context.assertStrictEqual(eventX.cancelable, true);
        context.assertStrictEqual(eventX.canceled, false);
        context.assertStrictEqual(eventY.cancelable, false);
        context.assertStrictEqual(eventY.canceled, false);

        eventEmitter.on('x', (event) => {
            context.assertStrictEqual(event.canceled, false);
            log += 'a';
        });

        eventEmitter.on('x', (event) => {
            event.cancel();
            log += 'b';
        });

        eventEmitter.on('x', (event) => {
            context.assertStrictEqual(event.canceled, true);
            log += 'c';
        });

        eventEmitter.on('y', (event) => {
            context.assertStrictEqual(event.canceled, false);
            log += '0';
        });

        eventEmitter.on('y', (event) => {
            event.cancel();
            log += '1';
        });

        eventEmitter.on('y', (event) => {
            context.assertStrictEqual(event.canceled, false);
            log += '2';
        });

        eventEmitter.emit(eventX);
        context.assertStrictEqual(eventX.canceled, true);

        eventEmitter.emit(eventY);
        context.assertStrictEqual(eventY.canceled, false);

        context.assertStrictEqual(log, 'abc012');

    },

    addListeners(context) {

        /**
         * @typedef {HEvent.Event<'a', string>} EventA
         * @typedef {HEvent.Event<'b', string>} EventB
         */

        /**
         * @type {HEvent.EventEmitter<{ a: EventA; b: EventB; }>}
         */
        const eventEmitter = new EventEmitter();
        let log = '';

        /**
         * @param {EventA | EventB} event
         */
        const logger = (event) => {
            log += event.data;
        };

        HEvent.addListeners(eventEmitter, {
            a: logger,
            b: {
                listener: logger,
                once: true,
            },
        });

        /**
         * @type {EventA}
         */
        const eventA = new Event({ name: 'a', data: '0' });

        /**
         * @type {EventB}
         */
        const eventB = new Event({ name: 'b', data: '1' });

        eventEmitter.emit(eventA);
        eventEmitter.emit(eventB);
        eventEmitter.emit(eventA);
        eventEmitter.emit(eventB);

        context.assertStrictEqual(log, '010');

    },

});
