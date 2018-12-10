# event-emitter

A simpler and lighter EventEmitter by TypeScript for Node.js or Browsers.

## Overview

- [EventEmitter](#eventemitter)
- [globalEvent](#globalevent)
- [on](#on)
- [once](#once)
- [off](#off)
- [offAll](#offall)
- [fire](#fire)
- [has](#has)
- [getHandlers](#gethandlers)
- [EventHandler](#eventhandler)
- [Event](#event)

## API

### EventEmitter

It's a class for managing events. It can be extended to provide event functionality for other classes or object.

- **class** - ES6 Class

There have two ways to use it.

One way:

```typescript
const emitter = new EventEmitter();
emitter.on('event', evt => {
  console.log(evt);
});
```

Another way:

```typescript
class Store extends EventEmitter {
  set(key: string, value: any) {
    this.fire(`change:${key}`, value);
  }
}
```

### globalEvent

A instance of EventEmitter for global, you can use it directly as an event emitter at global scope.

```typescript
// the code maybe in `a.ts`
globalEvent.on('event', evt => {
  console.log(evt);
});
```

```typescript
// the code maybe in `b.ts`
globalEvent.fire('event', 'test data');
```

### on

Listen on a new event by type and handler. If listen on, the true is returned, otherwise the false.
The handler will not be listen if it is a duplicate.

- **type** (`string`) - event type, it must be a unique string.
- **handler** ([EventHandler](#eventhandler)) - event handler, when if the same handler is passed, listen it by only once.
- **return** (`boolean`) If listen on, the true is returned, otherwise the false.

```typescript
const emitter = new EventEmitter();
emitter.on('event', evt => {
  console.log(evt);
});
```

### once

Listen on an once event by type and handler. When the event is fired, that will be listen off immediately and automatically.
The handler will not be listen if it is a duplicate.

- **type** (`string`) - event type, it must be a unique string.
- **handler** ([EventHandler](#eventhandler)) - event handler, when if the same handler is passed, listened by only once.
- **return** (`boolean`) If listened on, the true is returned, otherwise the false.

```typescript
const emitter = new EventEmitter();
emitter.once('event', evt => {
  console.log(evt);
});
```

### off

Listen off an event by type and handler.
Or listen off events by type, when if only type argument is passed.
Or listen off all events, when if no arguments are passed.

- _**[type]**_ (`string` `optional`) event type
- _**[handler]**_ ([EventHandler](#eventhandler) `optional`) event handler

Listen off the specified event.

```typescript
const emitter = new EventEmitter();
emitter.off('event', evt => undefined);
```

Listen off events by type.

```typescript
const emitter = new EventEmitter();
emitter.off('event');
```

Listen off all events, it does samething as `offAll` method.

```typescript
const emitter = new EventEmitter();
emitter.off();
```

### offAll

Listen off all events, that means every event will be emptied.

```typescript
const emitter = new EventEmitter();
emitter.offAll();
```

### fire

Fire the specified event, and you can to pass a data. When fired, every handler attached to that event will be executed.
But, if it's an once event, listen off it immediately after called handler.

- **type** (`string`) - event type
- _**[data]**_ (`any`) - event data

```typescript
const emitter = new EventEmitter();
emitter.fire('event', 'test data');
```

### has

Check whether the specified event has been listen on.
Or check whether the events by type has been listen on, when if only `type` argument is passed.

- **type** (`string`) - event type
- _**[handler]**_ ([EventHandler](#eventhandler) `optional`) - event handler
- **return** (`boolean`) If the event is listen on, the true is returned, otherwise the false.

```typescript
const emitter = new EventEmitter();
if (emitter.has('event')) {
  console.log('has `event`');
}
```

### getHandlers

Get the handlers for the specified event type.

- **type** (`string`) - event type
- **return** ([EventHandler](#eventhandler))

```typescript
const emitter = new EventEmitter();
const handlers = emitter.getHandlers('event');
console.log(handlers);
```

### EventHandler

The event handler, that is a normal function.

- **evt** ([Event](#event)) - event object, that will be pass to event handler as it argument.

### Event

Event object.

- **type** (`string`) - event type
- **data** (`any`) - event data
- **timestamp** (`number`) - the timestamp when event fired
- **once** (`boolean`) - it is an once event, that meaning listen off after event fired

## License

[MIT License](LICENSE)
