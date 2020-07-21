
  class Game{
    constructor(playerid){
      this.self = new Player(playerid);
      this.lastupdate = performance.now();
      this.players = [];
      this.objectives = [];
      this.canvas = document.getElementById("gamecanvas");
      this.ctx = this.canvas.getContext("2d");
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.ghost = null;
    }
    changedirection(e){
      if(e.key=="ArrowRight"){
        if(this.self.getsegmenthead().direction != 0){
          
          networksend({PacketId:identifiers.kDirection,Direction:0});
          this.self.getsegmenthead().direction = 0;
        }
      }else if(e.key=="ArrowDown"){
        if(this.self.getsegmenthead().direction != 1){
          
          networksend({PacketId:identifiers.kDirection,Direction:1});
          this.self.getsegmenthead().direction = 1;
        }
      }
      else if(e.key=="ArrowLeft"){
        if(this.self.getsegmenthead().direction != 2){
          
          networksend({PacketId:identifiers.kDirection,Direction:2});
          this.self.getsegmenthead().direction = 2;
        }
      }
      else if(e.key=="ArrowUp"){
        if(this.self.getsegmenthead().direction != 3){
          
          networksend({PacketId:identifiers.kDirection,Direction:3});
          this.self.getsegmenthead().direction = 3;
        }
      }else if(e.which == 32){
        networksend({PacketId: identifiers.kAddSegment});
      }
    }
    insertplayer(packet){
      if(packet.PlayerId == this.self.playerid){
        window.addEventListener("keydown",this.changedirection.bind(this),true);
        this.self.speed = packet.Speed;
        for(let e of packet.Positions){
          this.self.addsegment(e.XPosition,e.YPosition,e.Direction);
        }
        this.self.dxpos = packet.Positions[0].XPosition;
        this.self.dypos = packet.Positions[0].YPosition;
        this.players.push(this.self);
        //let objective = new Segment(600,500,0);
       // this.objectives.push(objective);
        requestAnimationFrame(this.frame.bind(this));
      }else{
        let p = new Player(packet.PlayerId);
        p.speed = packet.Speed;
        for(let e of packet.Positions){
          p.addsegment(e.XPosition,e.YPosition,e.Direction);
        }
        p.dxpos = packet.Positions[0].XPosition;
        p.dypos = packet.Positions[0].YPosition;
        this.players.push(p);
      }
    }
    frame(time){
      
      let delta = (time - this.lastupdate )/1000;

      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      this.ctx.fillStyle = '#353133'
      this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
      let scrollx = (this.canvas.width / 2 - 10 / 2 - this.self.getsegmenthead().xpos) ;
      let scrolly = (this.canvas.height / 2 - 10 / 2 - this.self.getsegmenthead().ypos) ;
      this.ctx.save();
      this.ctx.translate(scrollx,scrolly);
      //this.ctx.scale(2,2);
      for(let index = 0; index < this.players.length;++index){
        this.players[index].update(this.ctx,delta);
        this.players[index].draw(this.ctx);
      }

      for(var index = 0; index < this.objectives.length;++index){
        this.ctx.fillStyle = "#e58264";
        this.ctx.fillRect(this.objectives[index].xpos,this.objectives[index].ypos,10,10);
      }

      if(this.ghost!=null){
        this.ghost.update(this.ctx,delta);
        this.ghost.draw(this.ctx);
      }
      this.ctx.restore();
  
      this.lastupdate = time;
      requestAnimationFrame(this.frame.bind(this));
    }
    interpolateplayerposition(packet){
      for(let index = 0; index < this.players.length;++index){
        let player = this.players[index];
        if(player.playerid == packet.PlayerId){
          
          player.dxpos = packet.XPosition;
          player.dypos = packet.YPosition;
          break;
        }
      }
  }
  addsegment(packet){
    for(let index = 0; index < this.players.length;++index){
      let target = this.players[index];
      if(packet.PlayerId  == target.playerid){
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
  setdirection(packet){
    for(let index = 0; index < this.players.length;++index){
      let target = this.players[index];
      if(packet.PlayerId  == target.playerid){
        target.getsegmenthead().direction = packet.Direction;
        break;
      }
      
    }
  }
  addobjectives(packet){
    for(let e of packet.Positions){
      let objective = new Segment(e.XPosition,e.YPosition,e.Direction);
      this.objectives.push(objective);
    }
  }
  spawnobjective(packet){
    this.objectives.push(new Segment(packet.XPosition,packet.YPosition,packet.Direction));
  }
  despawnobjective(packet){

    var target = 0;
    for(var index = 0; index < this.objectives.length;++index){
      let objective = this.objectives[index];
      if(objective.xpos == packet.XPosition && objective.ypos == packet.YPosition){
        target = index;

        break;
      }
    }
    this.objectives.splice(target,1);
  }
  despawn(packet){
    var target = 0;
    for(var index = 0; index < this.players.length;++index){
      if(this.players[index].playerid==packet.PlayerId){
        target = index;
        break;
      }
    }
    this.players.splice(target,1);
  }
  spawnghost(packet){
    console.log(packet);
    this.ghost = new Player(0);
    for(let e of packet.Positions){
      this.ghost.body.push(new Segment(e.XPosition,e.YPosition,e.Direction));
    }
    this.ghost.dxpos = packet.Positions[0].XPosition;
    this.ghost.dypos = packet.Positions[0].YPosition;
  }
}
