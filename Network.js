
    let ws = new WebSocket("ws://jdragon.me:8080");
    let identifiers = new PacketIdentifier();
    var g;
    ws.onopen = function(){
        g = new Game(0);
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
        g.packets.push(packet);
        

        //console.log(packet);
        
    }
