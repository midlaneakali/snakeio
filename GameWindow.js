window.addEventListener('DOMContentLoaded', (event) => {
  let canvas = document.getElementById("gamecanvas");
  let ctx = canvas.getContext("2d");
  
  let direction = new Direction();
  let p = new Player(0,200,200,direction.right,30.0,1);
  let frametime = performance.now();
  window.addEventListener("keydown",changedirection,true);

  function changedirection(e){
    if(e.key=="ArrowRight"){
      p.changedirection(direction.right);
    }else if(e.key=="ArrowDown"){
      p.changedirection(direction.down);
    }
    else if(e.key=="ArrowLeft"){
      p.changedirection(direction.left);
    }
    else if(e.key=="ArrowUp"){
      p.changedirection(direction.up);
    }else if(e.which == 32){
      p.addsegment();
    }
  }
  function frame(time){

    let delta = (time-frametime)/1000;
    p.update(ctx,delta);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let scrollx = (canvas.width / 2 - 10 / 2 - p.body[0].xpos) ;
    let scrolly = (canvas.height / 2 - 10 / 2 - p.body[0].ypos) ;
    ctx.translate(scrollx,scrolly);
    p.draw(ctx);
    ctx.resetTransform();

    frametime = time;
    requestAnimationFrame(frame);

    
  }
  requestAnimationFrame(frame);
});