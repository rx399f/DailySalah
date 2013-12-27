(function(){
    /*HTML5 Stop Watch by Braden Best aka B1KMusic*/
    /*You can use this script anywhere and it will work*/
    var cvs,ctx,W,H,mem,StopWatch,Button,mouse;
    mem = {};
    mouse = {x:-10,y:-10,down:false};
    cvs = document.createElement('canvas');
    cvs.width = W = 240;
    cvs.height = H = 80;
    (function appendCanvas(){
        if(document.body)document.body.appendChild(cvs);
        else setTimeout(appendCanvas,100);
    })();
    ctx = cvs.getContext('2d');
    function add(o){
        o.id = Math.floor(Math.random()*10000).toString(36);
        for(var i in mem){
            if(mem.hasOwnProperty(i) && i == o.id){
                add(o);
                return false;
            }
        }
        mem[o.id] = o;
    };
    function remove(o){
        delete mem[o.id];
    };
    function StopWatch(){
        var started = false,
            time = [[0],[0,0],[0,0],[0,0]];
        this.run = function(){
            var output,
                h = time[0],
                m = time[1],
                s = time[2],
                ms = time[3];
            if(started){
                ms[1]++;
                if(ms[1]>9){ms[1]=0;ms[0]++;}
                if(ms[0]>9){ms[0]=0;s[1]++;}
                if(s[1]>9){s[1]=0;s[0]++;}
                if(s[0]>5){s[0]=0;m[1]++;}
                if(m[1]>9){m[1]=0;m[0]++;}
                if(m[0]>5){m[0]=0;h[0]++;}
                if(h[0]>23){ms=[0,0];s=[0,0];m=[0,0];h[0]=0;}
            }
            ctx.font = 'bold 36px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#000';
            output = h[0]+':'+m[0]+m[1]+':'+s[0]+s[1]+'.'+ms[0]+ms[1];
            ctx.fillText(output,W/2,20);
        };
        this.start = function(){
            started = true;
        };
        this.stop = function(){
            started = false;
        };
        this.reset = function(){
            remove(this);
            new StopWatch();
        }
        add(this);
    };
    function Button(x,y,t){
        var x = x, y = y, w = 60, h = 30, t = t;
        this.run = function(){
            ctx.font = 'bold 16px monospace';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.beginPath();//begin mouse detection
            ctx.rect(x,y,w,h);
            if(ctx.isPointInPath(mouse.x,mouse.y)){
                ctx.fillStyle = '#eee';
                if(mouse.down){
                    for(var i in mem){
                        if(mem[i].constructor.name == 'StopWatch'){
                            if(t == 'START')mem[i].start();
                            if(t == 'STOP')mem[i].stop();
                            if(t == 'RESET')mem[i].reset();
                            if(t == 'CLOSE')document.body.removeChild(cvs);
                        }
                    }
                }
            }else{
                ctx.fillStyle = '#fff';
            }
            ctx.closePath();//end mouse detection
            ctx.fillRect(x,y,w,h);
            ctx.fillStyle = '#000';
            ctx.fillText(t,x+w/2,y+h/2);
        };
        add(this);
    };
    (function init(){
        new StopWatch();
        new Button(0,50,'START');
        new Button(60,50,'STOP');
        new Button(120,50,'RESET');
        new Button(180,50,'CLOSE');
    })();
    (function loop(){
        var a
        ctx.clearRect(0,0,W,H);
        for(a in mem)if(mem.hasOwnProperty(a))mem[a].run();
        setTimeout(loop,1000/100);
    })();
    cvs.onmousemove = function(e){
        mouse.x = (e.pageX||e.clientX||e.offsetX) - cvs.offsetLeft;
        mouse.y = (e.pageY||e.clientY||e.offsetY) - cvs.offsetTop;
        return false;
    };
    cvs.onmousedown = cvs.onmouseup = function(e){
        mouse.down = e.type == 'mousedown';
        return false;
    };
})();