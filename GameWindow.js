
class Game {
  constructor(playerid) {
    this.self = null;
    this.lastupdate = performance.now();
    this.players = [];
    this.objectives = [];
    this.canvas = document.getElementById("gamecanvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.packets = [];
    this.playerid = null;
    this.name = null;
    
    requestAnimationFrame(this.frame.bind(this));
  }
  changedirection(e) {
    if (e.key == "ArrowRight") {
      if (this.self.getsegmenthead().direction != 0) {

        networksend({ PacketId: identifiers.kDirection, Direction: 0 });
        //this.self.getsegmenthead().direction = 0;
      }
    } else if (e.key == "ArrowDown") {
      if (this.self.getsegmenthead().direction != 1) {

        networksend({ PacketId: identifiers.kDirection, Direction: 1 });
        //this.self.getsegmenthead().direction = 1;
      }
    }
    else if (e.key == "ArrowLeft") {
      if (this.self.getsegmenthead().direction != 2) {

        networksend({ PacketId: identifiers.kDirection, Direction: 2 });
        //this.self.getsegmenthead().direction = 2;
      }
    }
    else if (e.key == "ArrowUp") {
      if (this.self.getsegmenthead().direction != 3) {

        networksend({ PacketId: identifiers.kDirection, Direction: 3 });
        //this.self.getsegmenthead().direction = 3;
      }
    } else if (e.which == 32) {
      networksend({ PacketId: identifiers.kAddSegment });
    }
  }
  gamepadobserver(direction){
    if(direction.e){
      networksend({ PacketId: identifiers.kDirection, Direction: 0 });
    }else if(direction.s){
      networksend({ PacketId: identifiers.kDirection, Direction: 1 });
    }
    else if(direction.w){
      networksend({ PacketId: identifiers.kDirection, Direction: 2 });
    }
    else if(direction.n){
      networksend({ PacketId: identifiers.kDirection, Direction: 3 });
    }
  }
  insertplayer(packet) {
    console.log(packet);
    if (packet.PlayerId == this.playerid) {
      this.self = new Player(this.playerid);
      this.self.name = packet.Name;
      window.addEventListener("keydown", this.changedirection.bind(this), true);
      this.self.speed = packet.Speed;
      for (let e of packet.Positions) {
        this.self.addsegment(e.XPosition, e.YPosition, e.Direction);
      }
      this.self.dxpos = packet.Positions[0].XPosition;
      this.self.dypos = packet.Positions[0].YPosition;
      this.players.push(this.self);
      //let objective = new Segment(600,500,0);
      // this.objectives.push(objective);

    } else {
      let p = new Player(packet.PlayerId);
      p.name = packet.Name;
      p.speed = packet.Speed;
      for (let e of packet.Positions) {
        p.addsegment(e.XPosition, e.YPosition, e.Direction);
      }
      p.dxpos = packet.Positions[0].XPosition;
      p.dypos = packet.Positions[0].YPosition;
      this.players.push(p);
    }
  }
  frame(time) {

    let delta = (time - this.lastupdate) / 1000;
    while (this.packets.length > 0) {
      let packetarray = this.packets.shift();
      for (let packet of packetarray) {
        this.packethandler(packet);
      }

    }
    
    //console.log(map);
    if (time - this.lastupdate > 30) {
      var map = CanvasGamepad.observe();
      this.gamepadobserver(map);
      //console.log(map);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      /*
      //deque packets here
      //
      */
      if (this.self != null) {
        this.ctx.fillStyle = '#353133'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        let scrollx = (this.canvas.width / 2 - 10 / 2 - this.self.getsegmenthead().xpos);
        let scrolly = (this.canvas.height / 2 - 10 / 2 - this.self.getsegmenthead().ypos);
        this.ctx.save();
        this.ctx.translate(scrollx, scrolly);
        //this.ctx.scale(2,2);
        for (let index = 0; index < this.players.length; ++index) {
          this.players[index].update(this.ctx, delta);
          this.players[index].draw(this.ctx);
        }

        for (var index = 0; index < this.objectives.length; ++index) {
          this.ctx.fillStyle = "#e58264";
          this.ctx.fillRect(this.objectives[index].xpos, this.objectives[index].ypos, 10, 10);
        }
        
        this.ctx.strokeStyle = 'red';
        this.ctx.strokeRect(0,0,4000,4000);
        
        this.ctx.restore();
        
      }

      this.lastupdate = time;
    }

    requestAnimationFrame(this.frame.bind(this));
  }
  interpolateplayerposition(packet) {
    for (let index = 0; index < this.players.length; ++index) {
      let player = this.players[index];
      if (player.playerid == packet.PlayerId) {

        player.dxpos = packet.XPosition;
        player.dypos = packet.YPosition;
        break;
      }
    }
  }
  addsegment(packet) {
    for (let index = 0; index < this.players.length; ++index) {
      let target = this.players[index];
      if (packet.PlayerId == target.playerid) {
        /*
        for(let e of packet.Positions){
          target.addsegment(e.XPosition,e.YPosition,e.Direction);

        }
        */
        target.pushsegment();
        break;
      }
    }
  }
  setdirection(packet) {
    for (let index = 0; index < this.players.length; ++index) {
      let target = this.players[index];
      if (packet.PlayerId == target.playerid) {
        target.getsegmenthead().direction = packet.Direction;
        break;
      }

    }
  }
  addobjectives(packet) {
    for (let e of packet.Positions) {
      let objective = new Segment(e.XPosition, e.YPosition, e.Direction);
      this.objectives.push(objective);
    }
  }
  spawnobjective(packet) {
    this.objectives.push(new Segment(packet.XPosition, packet.YPosition, packet.Direction));
  }
  despawnobjective(packet) {

    var target = 0;
    for (var index = 0; index < this.objectives.length; ++index) {
      let objective = this.objectives[index];
      if (objective.xpos == packet.XPosition && objective.ypos == packet.YPosition) {
        target = index;

        break;
      }
    }
    this.objectives.splice(target, 1);
  }
  despawn(packet) {
    var target = 0;
    for (var index = 0; index < this.players.length; ++index) {
      if (this.players[index].playerid == packet.PlayerId) {
        target = index;
        break;
      }
    }
    this.players.splice(target, 1);
  }
  packethandler(packet) {
    switch (packet.PacketId) {
      case identifiers.kSelf: {
        //this.self = new Player(packet.PlayerId);
        this.playerid = packet.PlayerId;
      }
        break;
      case identifiers.kInGame: {

      }
        break;
      case identifiers.kLeftGame: {

      }
        break;
      case identifiers.kSpawn: {

        /*
        if(packet.PlayerId==g.playerid){
            g.beginplay(packet.Positions[0].XPosition,packet.Positions[0].YPosition,packet.Positions[0].Direction,20.0);
        }
        */
        console.log(packet);
        this.insertplayer(packet);
      }
        break;
      case identifiers.kDespawn: {
        this.despawn(packet);
      }
        break;
      case identifiers.kMovement: {
        // g.self.body[0].xpos = packet.Positions[0].XPosition;
        // g.self.body[0].ypos = packet.Positions[0].YPosition;
        this.interpolateplayerposition(packet);
      }
        break;
      case identifiers.kAddSegment: {
        this.addsegment(packet);
      }
        break;
      case identifiers.kDirection: {
        this.setdirection(packet);
      }
        break;
      case identifiers.kCollision: {
        console.log("COLLISION!");
      }
        break;
      case identifiers.kObjective: {
        this.addobjectives(packet);
      }
        break;
      case identifiers.kDespawnObjective: {
        this.despawnobjective(packet);

      }
        break;
      case identifiers.kSpawnObjective: {
        this.spawnobjective(packet);

      }
        break;
    }
  }
}
