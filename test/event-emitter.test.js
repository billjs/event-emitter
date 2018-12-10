import { EventEmitter, globalEvent } from '../lib';
import { expect } from 'chai';

describe('EventEmitter', () => {
  describe('#getHandlers()', () => {
    it('should return handlers for the specified type', () => {
      const emitter = new EventEmitter();
      const h1 = () => {};
      const h2 = () => {};
      const h3 = () => {};
      emitter.on('change:name', h1);
      emitter.on('change:age', h2);
      emitter.on('change:age', h3);
      const handlers1 = emitter.getHandlers('change:name');
      expect(handlers1).to.be.deep.eq([h1]);
      const handlers2 = emitter.getHandlers('change:age');
      expect(handlers2).to.be.deep.eq([h2, h3]);
    });

    it('should return empty array for invalid or unlistened type', () => {
      const emitter = new EventEmitter();
      expect(emitter.getHandlers('event')).to.be.empty;
      expect(emitter.getHandlers()).to.be.empty;
    });
  });

  describe('#has()', () => {
    it('should has the event handler', () => {
      const type = 'change:name';
      const handler = () => undefined;
      const emitter = new EventEmitter();
      emitter.on(type, handler);
      expect(emitter.has(type, handler)).to.be.true;
      expect(emitter.has(type)).to.be.true;
    });

    it('should not has event handler for unlistened', () => {
      const type = 'change:name';
      const emitter = new EventEmitter();
      expect(emitter.has(type, () => undefined)).to.be.false;
      expect(emitter.has(type)).to.be.false;
    });
  });

  describe('#fire()', () => {
    it('should invoke the handler', done => {
      const type = 'change:name';
      const emitter = new EventEmitter();
      emitter.on(type, () => done());
      emitter.fire(type);
    });

    it('should pass data to the handler', done => {
      const type = 'change:name';
      const emitter = new EventEmitter();
      emitter.on(type, evt => {
        expect(evt).to.have.property('data', 'new name');
        done();
      });
      emitter.fire(type, 'new name');
    });

    it('should invoke the specified type events', done => {
      const emitter = new EventEmitter();
      emitter.on('change:name', evt => {
        expect(evt).to.have.property('data', 'bill');
      });
      emitter.on('change:age', evt => {
        expect(evt).to.have.property('data', 32);
      });
      emitter.fire('change:name', 'bill');
      emitter.fire('change:age', 32);
      done();
    });
  });

  describe('#on()', () => {
    it('should has `type` property in handler argument', done => {
      const type = 'change:name';
      const emitter = new EventEmitter();
      emitter.on(type, evt => {
        expect(evt).to.have.property('type', type);
        done();
      });
      emitter.fire(type);
    });

    it('should listen more than once for same event', () => {
      let count = 0;
      const type = 'change:name';
      const emitter = new EventEmitter();
      emitter.on(type, () => {
        count++;
      });
      emitter.on(type, () => {
        count++;
      });
      emitter.fire(type);
      expect(count).to.be.eq(2);
    });

    it('should invoke more than once for same handler', done => {
      let count = 0;
      const type = 'change:name';
      const emitter = new EventEmitter();
      emitter.on(type, evt => {
        expect(evt).to.have.property('data', 'name' + ++count);
        if (evt.data === 'name2' && count === 2) done();
      });
      emitter.fire(type, 'name1');
      emitter.fire(type, 'name2');
    });

    it('should listened only once for same handler', () => {
      let invoked = 0;
      const type = 'change:name';
      const handler = () => {
        invoked++;
      };
      const emitter = new EventEmitter();
      const ret1 = emitter.on(type, handler);
      expect(ret1).to.be.true;
      const ret2 = emitter.on(type, handler);
      expect(ret2).to.be.false;
      emitter.fire(type, 'new name');
      expect(invoked).to.be.eq(1);
    });

    it('should listen fail when if type is invalid', () => {
      const emitter = new EventEmitter();
      expect(emitter.on('', () => undefined)).to.be.false;
      expect(emitter.on(123, () => undefined)).to.be.false;
      expect(emitter.on(true, () => undefined)).to.be.false;
      expect(emitter.on({}, () => undefined)).to.be.false;
      expect(emitter.on([], () => undefined)).to.be.false;
      expect(emitter.on(null, () => undefined)).to.be.false;
      expect(emitter.on(undefined, () => undefined)).to.be.false;
    });

    it('should listen fail when if handler is invalid', () => {
      const emitter = new EventEmitter();
      expect(emitter.on('event', 'function')).to.be.false;
      expect(emitter.on('event', 123)).to.be.false;
      expect(emitter.on('event', true)).to.be.false;
      expect(emitter.on('event', {})).to.be.false;
      expect(emitter.on('event', [])).to.be.false;
      expect(emitter.on('event', null)).to.be.false;
      expect(emitter.on('event')).to.be.false;
    });
  });

  describe('#once()', () => {
    it('should invoke only once for the handler', () => {
      let name = '';
      const type = 'change:name';
      const emitter = new EventEmitter();
      const ret = emitter.once(type, evt => {
        name = evt.data;
      });
      expect(ret).to.be.true;
      emitter.fire(type, 'name1');
      emitter.fire(type, 'name2');
      expect(name).to.be.eq('name1');
    });
  });

  describe('#off()', () => {
    it('should unlisten a event by type and handler', () => {
      const emitter = new EventEmitter();
      const handler = () => undefined;
      emitter.on('event1', handler);
      emitter.on('event1', () => undefined);
      emitter.on('event2', () => undefined);
      expect(emitter.getHandlers('event1')).to.be.length(2);
      expect(emitter.getHandlers('event2')).to.be.length(1);
      emitter.off('event1', handler);
      expect(emitter.getHandlers('event1')).to.be.length(1);
      expect(emitter.getHandlers('event2')).to.be.length(1);
    });

    it('should unlisten events by type', () => {
      const emitter = new EventEmitter();
      emitter.on('event1', () => undefined);
      emitter.on('event1', () => undefined);
      emitter.on('event2', () => undefined);
      expect(emitter.getHandlers('event1')).to.be.length(2);
      expect(emitter.getHandlers('event2')).to.be.length(1);
      emitter.off('event1');
      expect(emitter.getHandlers('event1')).to.be.length(0);
      expect(emitter.getHandlers('event2')).to.be.length(1);
      emitter.off('event2');
      expect(emitter.getHandlers('event2')).to.be.length(0);
    });

    it('should unlisten all events', () => {
      const emitter = new EventEmitter();
      emitter.on('event1', () => undefined);
      emitter.on('event1', () => undefined);
      emitter.on('event2', () => undefined);
      expect(emitter.getHandlers('event1')).to.be.length(2);
      expect(emitter.getHandlers('event2')).to.be.length(1);
      emitter.off();
      expect(emitter.getHandlers('event1')).to.be.length(0);
      expect(emitter.getHandlers('event2')).to.be.length(0);
    });
  });

  describe('#offAll()', () => {
    it('should unlisten all events', () => {
      const emitter = new EventEmitter();
      emitter.on('event1', () => undefined);
      emitter.on('event1', () => undefined);
      emitter.on('event2', () => undefined);
      expect(emitter.getHandlers('event1')).to.be.length(2);
      expect(emitter.getHandlers('event2')).to.be.length(1);
      emitter.offAll();
      expect(emitter.getHandlers('event1')).to.be.length(0);
      expect(emitter.getHandlers('event2')).to.be.length(0);
    });
  });

  describe('globalEvent', () => {
    it('should `globalEvent` is instanceOf EventEmitter', () => {
      expect(globalEvent instanceof EventEmitter).to.be.true;
    });
  });
});
