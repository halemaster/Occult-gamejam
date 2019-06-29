/* global Phaser Colyseus ReactDOM */
import Player from '../entities/Player.js';
import MatchSceneComponent from '../react/MatchSceneComponent.js';

export const MATCH_SCENE_ID = 'matchScene';
export const MAP_WIDTH = 3200;
export const MAP_HEIGHT = 2400;

export default class MatchScene extends Phaser.Scene {
  constructor() {
    super(MATCH_SCENE_ID);
  }

  preload() {
    this.load.image('cultist_blue', './assets/images/cultist_blue.gif');
    this.load.image('background', './assets/images/background.gif');
    const domContainer = document.querySelector('#ui_container');
    ReactDOM.render(React.createElement(MatchSceneComponent, null), domContainer);
    this.playerList = new Map();
  }

  create() {
    this.background = this.add.tileSprite(0, 0, 3200, 2400, 'background');
    this.background.setOrigin(0, 0);

    this.cameras.main.fadeIn(2000);
    const MINIMAP_OFFSET = 10;
    this.cameras.add(MINIMAP_OFFSET, MINIMAP_OFFSET,
      MINIMAP_OFFSET + this.game.config.width / 4, MINIMAP_OFFSET + this.game.config.height / 4)
      .setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT).setName('minimap')
      .setZoom(this.game.config.width / MAP_WIDTH / 4).centerOn(MAP_WIDTH / 2, MAP_HEIGHT / 2);

    const websocketUrl = window.location.hostname === 'localhost' ?
      'ws://localhost:2567' :
      'wss://api' + window.location.hostname.substring(3) + ':443';
    this.client = new Colyseus.Client(websocketUrl);
    this.room = this.client.join('my_room');
    this.room.onJoin.add(() => {
      this.room.state.players.onAdd = (player, key) => {
        let playerObj = new Player(this.add.sprite(player.pos_x, -1 * player.pos_y, 'cultist_blue'));

        if (key === this.room.sessionId) {
          this.player = playerObj;
          this.cameras.main.startFollow(this.player.sprite);
        }

        this.playerList[key] = playerObj;

        player.onChange = changes => {
          this.playerList[key].change(changes);
        };
      };

      this.room.state.players.onRemove = (player, key) => {
        this.playerList[key].destructor();
        delete this.playerList[key];
      };
    });

    // add handlers for key presses

    this.input.keyboard.on('keydown', event => {
      this.room.send({
        key: {
          pressed: true,
          keyCode: event.keyCode
        }
      });
    });
    this.input.keyboard.on('keyup', event => {
      this.room.send({
        key: {
          pressed: false,
          keyCode: event.keyCode
        }
      });
    });
  }

  update() {
    var a = 0;
  }

}
