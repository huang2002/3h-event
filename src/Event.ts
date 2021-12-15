export type EventName = string | symbol;
/** dts2md break */
export interface EventDescription<NameType extends EventName, DataType> {
    name: NameType;
    data: DataType;
    /**
     * @default false
     */
    stoppable?: boolean;
    /**
     * @default false
     */
    cancelable?: boolean;
}
/** dts2md break */
export type EventInitializer<NameType extends EventName, DataType> =
    (timeStamp: number) => EventDescription<NameType, DataType>;
/** dts2md break */
export type EventInit<NameType extends EventName, DataType> =
    | EventDescription<NameType, DataType>
    | EventInitializer<NameType, DataType>;
/** dts2md break */
export class Event<NameType extends EventName = EventName, DataType = unknown> {
    /** dts2md break */
    static timeGetter = Date.now;
    /** dts2md break */
    constructor(init: EventInit<NameType, DataType>) {
        const timeStamp = Event.timeGetter();
        const description = (typeof init === 'function') ? init(timeStamp) : init;
        this.timeStamp = timeStamp;
        this.name = description.name;
        this.data = description.data;
        this.stoppable = description.stoppable === true;
        this.cancelable = description.cancelable === true;
    }
    /** dts2md break */
    readonly name: NameType;
    readonly timeStamp: number;
    readonly data: DataType;
    readonly stoppable: boolean;
    readonly cancelable: boolean;

    private _stopped = false;
    private _canceled = false;
    /** dts2md break */
    get stopped() {
        return this._stopped;
    }
    /** dts2md break */
    get canceled() {
        return this._canceled;
    }
    /** dts2md break */
    stop() {
        if (this.stoppable) {
            this._stopped = true;
        }
    }
    /** dts2md break */
    cancel() {
        if (this.cancelable) {
            this._canceled = true;
        }
    }

}
