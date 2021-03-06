class Segment{
    constructor(xpos,ypos,direction){
        this.xpos = xpos;
        this.ypos = ypos;
        this.direction = direction;
    }
}
class Player{
    constructor(playerid){
        this.playerid = playerid;
 
        this.speed = 25.0;
        this.body = [];
        this.delta = 0.016;;
        this.lastprint = performance.now();
        this.dxpos = 0;
        this.dypos = 0;
        this.name = "";
        this.boosted = false;
    }
    addsegment(xpos,ypos,directon){
        this.body.push(new Segment(xpos,ypos,directon));
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
        for(var x = 0; x < 10;++x){
            let segment = this.getsegmentposition();
            this.body.push(segment);   
        }
    }
    calculatesegmentposition(segment,delta){
        let newspeed = this.speed;
        if(this.boosted){
            newspeed*=4;
        }
        switch(segment.direction){

            case 0:{
                this.dxpos+=newspeed*delta;
            }
            break;
            case 1:{
                this.dypos+=newspeed*delta;

            }
            break;
            case 2:{
                this.dxpos-=newspeed*delta;

            }
            break;
            case 3:{
                this.dypos-=newspeed*delta;

            }
            break;
        }
    }
    inbounds(segment){
        if(segment.xpos>=0&&segment.ypos>=0&&segment.xpos<3000&&segment.ypos<3000){
            return true;
        }
        return false;
    }
    isleftedge(segment){
        if(segment.xpos<=0){
            return true;
        }
        return false;
    }
    istopedge(segment){
        if(segment.ypos<=0){
            return true;
        }
        return false;
    }
    isrightedge(segment){
        if(segment.xpos>=4000){
            return true;
        }
        return false;
    }
    isbottomedge(segment){
        if(segment.ypos>=4000){
            return true;
        }
        return false;
    }
    update(ctx,delta){
        this.delta = delta;
        let now = performance.now();
        if(now-this.lastprint>3000){
            this.lastprint = now;
        }

        for(var s = this.body.length-1; s > 0;--s){
            let segment = this.body[s];
            let target = this.body[s-1];
            segment.xpos = target.xpos;
            segment.ypos = target.ypos;
            segment.direction = target.direction;
            //this.addwhtosegment(segment);
  
        }

        
        let head = this.getsegmenthead();
        this.calculatesegmentposition(this.body[0],delta);
        let newspeed = this.speed;

        /*
        CAREFUL WITH THE CODE BELOW 
        IF GTHE SERVER AND CLIENT ARE RUNNING AT DIFFERENT FRAME RATES THIS WILL THROW SYNCHRONISATION OFF
        BOTH CLIENT AND SERVER ARE RUNNING AT 30 FRAMES
        */
        if(this.boosted){
            newspeed*=4;
        }
        head.xpos = this.interpolatemovement(head.xpos,this.dxpos,newspeed*delta);
        head.ypos = this.interpolatemovement(head.ypos,this.dypos,newspeed*delta);

        if(this.isleftedge(head)){
            head.dxpos = 3999.0;
            head.xpos = 3999.0;
        }
        else if(this.istopedge(head)){
            head.dypos = 3999.0;
            head.ypos = 3999.0;
        }
        else if(this.isrightedge(head)){
            head.dxpos = 1.0;
            head.xpos = 1.0;
        }
        else if(this.isbottomedge(head)){
            head.dypos = 1.0;
            head.ypos = 1.0;
        }
        /*
        CAREFUL WITH THE CODE BELOW 
        IF GTHE SERVER AND CLIENT ARE RUNNING AT DIFFERENT FRAME RATES THIS WILL THROW SYNCHRONISATION OFF
        BOTH CLIENT AND SERVER ARE RUNNING AT 30 FRAMES
        */
        if(this.boosted){
            if(this.body.length>1){
                this.body.pop();
            }else{
                this.boosted = false;
            }
        }
    }
    draw(ctx){
        
        ctx.fillStyle = '#497997';
        for(var s = 1; s < this.body.length;++s){
            let segment = this.body[s];
            ctx.fillRect(segment.xpos,segment.ypos,10,10);
    
        }
        ctx.fillStyle = '#e85261';
        ctx.fillRect(this.getsegmenthead().xpos,this.getsegmenthead().ypos,10,10);

        ctx.fillStyle = '#B2D06f';
        ctx.font = '15px sans-sarif';
        ctx.fillText(this.name,this.getsegmenthead().xpos+10,this.getsegmenthead().ypos-10,50);
    }
    
    interpolatemovement(current, target, maxdistancedelta) {
        if (Math.abs(target - current) <= maxdistancedelta) {
            return target;
        }
        return current + Math.sign(target - current) * maxdistancedelta;
    }
}