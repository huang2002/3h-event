/**
 * Type of event names.
 */
export type EventName = string | symbol;
/** dts2md break */
/**
 * Type of event description.
 */
export interface EventDescription<NameType extends EventName, DataType> {
    /**
     * Event name.
     */
    name: NameType;
    /**
     * Event data.
     */
    data: DataType;
    /**
     * Whether the propagation of the event
     * can be stopped by invoking `event.stop`.
     * @default false
     */
    stoppable?: boolean;
    /**
     * Whether the default behaviour of the event
     * can be canceled by invoking `event.cancel`.
     * @default false
     */
    cancelable?: boolean;
    /**
     * The time stamp when the event is created.
     * @default Event.getTimeStamp()
     */
    timeStamp?: number;
}
/** dts2md break */
/**
 * Type of event initializers
 * that return event description dynamically.
 */
export type EventInitializer<NameType extends EventName, DataType> =
    (timeStamp: number) => EventDescription<NameType, DataType>;
/** dts2md break */
/**
 * Type of event init arg.
 */
export type EventInit<NameType extends EventName, DataType> =
    | EventDescription<NameType, DataType>
    | EventInitializer<NameType, DataType>;
/** dts2md break */
/**
 * Class of event objects.
 */
export class Event<NameType extends EventName = EventName, DataType = unknown> {
    /** dts2md break */
    /**
     * The time stamp generator.
     * @default Date.now
     */
    static getTimeStamp = Date.now;
    /** dts2md break */
    /**
     * The constructor of event objects.
     */
    constructor(init: EventInit<NameType, DataType>) {
        const timeStamp = Event.getTimeStamp();
        const description = (typeof init === 'function') ? init(timeStamp) : init;
        this.timeStamp = description.timeStamp ?? timeStamp;
        this.name = description.name;
        this.data = description.data;
        this.stoppable = description.stoppable === true;
        this.cancelable = description.cancelable === true;
    }
    /** dts2md break */
    /**
     * The name of the event.
     */
    readonly name: NameType;
    /** dts2md break */
    /**
     * The time stamp when the event is created.
     * @default Event.getTimeStamp()
     */
    readonly timeStamp: number;
    /** dts2md break */
    /**
     * Custom event data.
     */
    readonly data: DataType;
    /** dts2md break */
    /**
     * Wether the propagation of the event
     * can be stopped by invoking `event.stop`.
     * @default false
     */
    readonly stoppable: boolean;
    /** dts2md break */
    /**
     * Whether the default behaviour of the event
     * can be canceled by invoking `event.cancel`.
     * @default false
     */
    readonly cancelable: boolean;

    private _stopped = false;
    private _canceled = false;
    /** dts2md break */
    /**
     * Whether the propagation of the event
     * has been stopped.
     */
    get stopped() {
        return this._stopped;
    }
    /** dts2md break */
    /**
     * Whether the default behaviour should be canceled.
     */
    get canceled() {
        return this._canceled;
    }
    /** dts2md break */
    /**
     * Stop the propagation of the event.
     */
    stop() {
        if (this.stoppable) {
            this._stopped = true;
        }
    }
    /** dts2md break */
    /**
     * Cancel the default behaviour the event.
     */
    cancel() {
        if (this.cancelable) {
            this._canceled = true;
        }
    }

}
