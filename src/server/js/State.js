const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const type = schema.type;
const Player = require('./Player').Player;

class State extends Schema {
  constructor () {
    super();
    // map of players, clientId : Player Object
    this.players = new MapSchema();
  }

  printPlayers () {
    var keys = Object.keys(this.players);
    keys.forEach(key => {
      console.log(key + ':');
      this.players[key].printEntity();
      this.players[key].printKeys();
    });
  }
}
// player list
type({ map: Player })(State.prototype, 'players');
// map dimensions
type('uint16')(State.prototype, 'width');
type('uint16')(State.prototype, 'height');


exports.State = State;
