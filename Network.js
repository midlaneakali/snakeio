
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
    function networksend(packet){
        ws.send(JSON.stringify(packet));
    }
    function packethandler(jsonpacket){
        let packet = JSON.parse(jsonpacket);
        //console.log(packet);
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
               
               g.insertplayer(packet);
            }
            break;
            case identifiers.kDespawn:{
                g.despawn(packet);
            }
            break;
            case identifiers.kMovement:{
               // g.self.body[0].xpos = packet.Positions[0].XPosition;
               // g.self.body[0].ypos = packet.Positions[0].YPosition;
               g.interpolateplayerposition(packet);
            }
            break;
            case identifiers.kAddSegment:{
                g.addsegment(packet);
            }
            break;
            case identifiers.kDirection:{
                g.setdirection(packet);
            }
            break;
            case identifiers.kCollision:{
             
            }
            break;
            case identifiers.kObjective:{
                g.addobjectives(packet);
            }
            break;
            case identifiers.kDespawnObjective:{
                g.despawnobjective(packet);
 
            }
            break;
            case identifiers.kSpawnObjective:{
                g.spawnobjective(packet);
              
            }
            break;
        }
    }
