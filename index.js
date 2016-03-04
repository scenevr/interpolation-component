/* globals AFRAME, performance, THREE */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

function Interpolator (timestep, entity) {
  var self = this;

  function getMillis () {
    return new Date().getTime();
  }

  this.time = getMillis();

  this.previous = {
    position: null
  };

  this.next = {
    position: null
  };

  entity.el.addEventListener('componentchanged', function (event) {
    if (event.detail.name === 'position') {
      if (!self.previous.position) {
        console.log('?');
        self.previous.position = new THREE.Vector3();
        self.next.position = new THREE.Vector3();
      }

      if (getTime() < 0.5) {
        // ignore multiple calls
        return;
      }

      self.time = getMillis();
      self.previous.position.copy(self.next.position);
      self.next.position.copy(event.detail.newData);
    }
  });

  function getTime () {
    return (getMillis() - self.time) / timestep;
  }

  this.active = function () {
    return self.previous.position && self.next.position && (getTime() < 1.0);
  };

  var v = new THREE.Vector3();

  this.getPosition = function () {
    return v.lerpVectors(self.previous.position, self.next.position, getTime());
  };
}

/**
 * Interpolate component for A-Frame.
 */
AFRAME.registerComponent('interpolation', {
  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {
    if (!this.interpolation) {
      var timestep = parseInt(this.el.getAttribute('interpolation'), 10);
      this.interpolation = new Interpolator(timestep, this);
    }
  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () { },

  /**
   * Called on each scene tick.
   */
  tick: function (t) {
    if (this.interpolation && this.interpolation.active()) {
      this.el.object3D.position.copy(this.interpolation.getPosition());
    }
  },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () { },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () { },
});
