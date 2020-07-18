export class Timeline {
  constructor() {
    this.animations = [];
    this.rafID = null;
    this.tick = () => {
      let t = Date.now() - this.startTime;
      let animations = this.animations.filter((a) => !a.isCompleted);
      for (let animation of animations) {
        if (animation.isCompleted || t > animation.duration + animation.delay) {
          animation.isCompleted = true;
          continue;
        }
        let {
          object,
          template,
          property,
          start,
          end,
          timingFunction,
          delay,
          duration,
        } = animation;
        let value = template(timingFunction(start, end)(t - delay));
        object[property] = value;
      }
      if (animations.length)
        this.rafID = requestAnimationFrame(() => this.tick());
    };
  }

  play() {
    this.startTime = Date.now();
    this.tick();
  }
  add(animation) {
    this.animations.push(animation);
  }
  pause() {
    if (this.rafID) {
      this.pauseTime = Date.now();
      cancelAnimationFrame(this.rafID);
      this.rafID = null;
    }
  }
  resume() {
    if (!this.rafID) {
      this.startTime += Date.now() - this.pauseTime;
      this.tick();
    }
  }
  restart() {
    this.pause();
    this.play();
  }
}

export class Animation {
  constructor(
    object,
    property,
    template,
    start,
    end,
    duration,
    delay,
    timingFunction
  ) {
    this.object = object;
    this.template = template;
    this.property = property;
    this.start = start;
    this.end = end;
    this.delay = delay || 0;
    this.duration = duration;
    this.timingFunction =
      timingFunction ||
      ((start, end) => {
        return (t) => {
          return start + (t * (end - start)) / this.duration;
        };
      });
  }
}

/**
 * let anumation = new Animation(object, property, start, end, duration, timingFunction)
 * let anumation2 = new Animation(object2, property2, start, end, duration, timingFunction)
 *
 * let timeline = new Timeline;
 * timeline.add(animation);
 * timeline.add(animation2);
 *
 * timeline.start()
 *
 * timeline.pause()
 * timeline.resume()
 * timeline.stop()
 *
 * setTimeout
 * setInterval
 * requestAnimationFrame
 *
 */
