window.addEventListener('DOMContentLoaded', (event) => {
    let ws = new WebSocket("ws://jdragon.me:8080");
    let identifiers = new PacketIdentifier();
    var g;
    ws.onopen = function(){

    }
    ws.onclose = function(){

    }
    ws.onmessage = function(evt){
        let packet = evt.data;
        
        packethandler(packet);
    }
    function packethandler(jsonpacket){
        let packet = JSON.parse(jsonpacket);
        
        switch(packet.PacketId){

            case identifiers.kSelf:{
                g = new Game(packet.PlayerId);
                
            }
            break;
            case identifiers.kInGame:{

            }
            break;
            case identifiers.kLeftGame:{

            }
            break;
            case identifiers.kSpawn:{
                
                /*
                if(packet.PlayerId==g.playerid){
                    g.beginplay(packet.Positions[0].XPosition,packet.Positions[0].YPosition,packet.Positions[0].Direction,20.0);
                }
                */
               console.log(packet);
               g.insertplayer(packet);
            }
            break;
            case identifiers.kDespawn:{

            }
            break;
            case identifiers.kMovement:{
               // g.self.body[0].xpos = packet.Positions[0].XPosition;
               // g.self.body[0].ypos = packet.Positions[0].YPosition;
            }
        }
    }
  });