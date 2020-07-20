class Segment{
    constructor(xpos,ypos,direction){
        this.xpos = xpos;
        this.ypos = ypos;
        this.direction = direction;
    }
}
class Player{
    constructor(playerid,xpos,ypos,direction,speed,length){
        this.playerid = playerid;
        this.speed = speed;
        this.length = length;   
        this.body = [];
        this.body.push(new Segment(xpos,ypos,direction));
        this.delta = 0.016;;
        this.lastprint = performance.now();
    }
    getsegmenthead(){
        return this.body[0];
    }
    changedirection(direction){
        this.getsegmenthead().direction = direction;
    }
    getsegmentoffset(segment){
        var x = segment.xpos;
        var y = segment.ypos;
        switch(segment.direction ){
            case 0:{
                x-=this.delta*this.speed;
            }
            break;
            case 1:{
                y-=this.delta*this.speed;
            }
            break;
            case 2:{
                x+=this.delta*this.speed;
            }
            break;
            case 3:{
                y+=this.delta*this.speed;
            }
            break;
        }
       
        return {xpos:x,ypos:y};
    }
    getsegmentposition(){
        let lastsegment = this.body[this.body.length-1];
   
        let offset = this.getsegmentoffset(lastsegment);
        let segment = new Segment(offset.xpos,offset.ypos,lastsegment.direction);
        return segment;
    }
    pushsegment(){
        for(var x = 0; x < 5;++x){
            let segment = this.getsegmentposition();
            this.body.push(segment);   
        }
    }
    calculatesegmentposition(segment,delta){
        switch(segment.direction){
            case 0:{
                segment.xpos+=this.speed*delta;
            }
            break;
            case 1:{
                segment.ypos+=this.speed*delta;

            }
            break;
            case 2:{
                segment.xpos-=this.speed*delta;

            }
            break;
            case 3:{
                segment.ypos-=this.speed*delta;

            }
            break;
        }
    }

    update(ctx,delta){
        this.delta = delta;
        let now = performance.now();
        if(now-this.lastprint>3000){
            this.lastprint = now;
            console.log(this.body[0].xpos);
        }

        for(var s = this.body.length-1; s > 0;--s){
            let segment = this.body[s];
            let target = this.body[s-1];
            segment.xpos = target.xpos;
            segment.ypos = target.ypos;
            segment.direction = target.direction;
            //this.addwhtosegment(segment);
  
        }
        this.calculatesegmentposition(this.body[0],this.delta);
    }
    draw(ctx){
        
        ctx.fillStyle = 'black';
        for(var s = 0; s < this.body.length;++s){
            let segment = this.body[s];
            ctx.fillRect(segment.xpos,segment.ypos,10,10);
    
        }
        
    }

}