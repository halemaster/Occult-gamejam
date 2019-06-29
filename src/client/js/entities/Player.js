export default class Player {
  constructor (sprite) {
    this.sprite = sprite;
  }

  destructor () {
    this.sprite.destroy();
  }

  change (changes) {
    changes.forEach(change => {
      if (change.field === 'pos_x') {
        this.setX(change.value, change.previousValue);
      }
      if (change.field === 'pos_y') {
        this.setY(change.value, change.previousValue);
      }
    });
  }

  setX (x, prevX) {
    this.sprite.x = x;
    this.sprite.flipX = (x === prevX ? this.sprite.flipX : x > prevX);
  }

  setY (y, prevY) {
    this.sprite.y = y;
  }
}
