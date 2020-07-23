
    let ws = new WebSocket("ws://jdragon.me:8080");
    let identifiers = new PacketIdentifier();
    var g;
    ws.onopen = function(){
        g = new Game(0);
       let name = localStorage.getItem('name');
       let randomkey = localStorage.getItem('random');
       let packet = {
        PacketId: identifiers.kNameRequest,
        Random: parseInt(randomkey,10),
        Name: name
       };
       networksend(packet);
    }
    ws.onclose = function(){

    }
    ws.onmessage = function(evt){
        let packet = evt.data;
        
        packethandler(packet);
    }
    function networksend(packet){
        let strung = JSON.stringify(packet);
        console.log(strung);
        ws.send(strung);
    }
    function packethandler(jsonpacket){
        
        let packet = JSON.parse(jsonpacket);
        if(Array.isArray(packet)){
            g.packets.push(packet);
        }else{

        }
        
        

        //console.log(packet);
        
    }
