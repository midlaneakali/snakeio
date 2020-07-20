
  class Game{
    constructor(playerid){
      this.playerid = playerid;
      this.self = new Player(this.playerid,0,0,0,0.0,1);
      this.lastupdate = performance.now();
      this.players = [];
      this.objectives = [];
      this.canvas = document.getElementById("gamecanvas");
      this.ctx = this.canvas.getContext("2d");
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
    changedirection(e){
      if(e.key=="ArrowRight"){
        if(this.self.getsegmenthead().direction != 0){
          this.self.getsegmenthead().direction = 0;
        }
      }else if(e.key=="ArrowDown"){
        if(this.self.getsegmenthead().direction != 1){
          this.self.getsegmenthead().direction = 1;
        }
      }
      else if(e.key=="ArrowLeft"){
        if(this.self.getsegmenthead().direction != 2){
          this.self.getsegmenthead().direction = 2;
        }
      }
      else if(e.key=="ArrowUp"){
        if(this.self.getsegmenthead().direction != 3){
          this.self.getsegmenthead().direction = 3;
        }
      }else if(e.which == 32){
        this.self.pushsegment();
      }
    }
    frame(time){
      
      let delta = (time - this.lastupdate )/1000;

      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      let scrollx = (this.canvas.width / 2 - 10 / 2 - this.self.getsegmenthead().xpos) ;
      let scrolly = (this.canvas.height / 2 - 10 / 2 - this.self.getsegmenthead().ypos) ;
      this.ctx.translate(scrollx,scrolly);

      this.self.update(this.ctx,delta);
      this.self.draw(this.ctx);

      for(var index = 0; index < this.objectives.length;++index){
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(this.objectives[index].xpos,this.objectives[index].ypos,10,10);
      }
      this.ctx.resetTransform();
  
      this.lastupdate = time;
      requestAnimationFrame(this.frame.bind(this));
    }
    beginplay(xpos,ypos,direction,speed){
      window.addEventListener("keydown",this.changedirection.bind(this),true);
      this.self.getsegmenthead().xpos = xpos;
      this.self.getsegmenthead().ypos = ypos;
      this.self.getsegmenthead().direction = direction;
      console.log("Direction: "+direction);
      this.self.speed = speed;
      this.players.push(this.self);
      let objective = new Segment(600,500,0);
      this.objectives.push(objective);
      requestAnimationFrame(this.frame.bind(this));
    }
  }
