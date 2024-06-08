myCanvas.width=500;
myCanvas.height=400;
const margin=30;
const n=30;
const array=[];
let moves=[];
const cols=[];
const spacing=(myCanvas.width-margin*2)/n;
const ctx=myCanvas.getContext("2d");

const maxColumnHeight=200;

init();

let audioCtx=null;

function playNote(freq,type){
    if(audioCtx==null){
        audioCtx=new(
            AudioContext || 
            webkitAudioContext || 
            window.webkitAudioContext
        )();
    }
    const dur=0.2;
    const osc=audioCtx.createOscillator();
    osc.frequency.value=freq;
    osc.start();
    osc.type=type;
    osc.stop(audioCtx.currentTime+dur);

    const node=audioCtx.createGain();
    node.gain.value=0.4;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime+dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}

function init(){
    for(let i=0;i<n;i++){
        array[i]=Math.random();
    }
    moves=[];
    for(let i=0;i<array.length;i++){
        const x=i*spacing+spacing/2+margin;
        const y=myCanvas.height-margin-i*3;
        const width=spacing-4;
        const height=maxColumnHeight*array[i];
        cols[i]=new Column(x,y,width,height);
    }
}

function play(){
    moves=bubbleSort(array);
}

animate();

function bubbleSort(array){
    const moves=[];
    do{
        var swapped=false;
        for(let i=1;i<array.length;i++){
            if(array[i-1]>array[i]){
                swapped=true;
                [array[i-1],array[i]]=[array[i],array[i-1]];
                moves.push(
                    {indices:[i-1,i],swap:true}
                );
            }else{
                moves.push(
                    {indices:[i-1,i],swap:false}
                );
            }
        }
    }while(swapped);
    return moves;
}

function animate(){
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    let changed=false;
    for(let i=0;i<cols.length;i++){
        changed=cols[i].draw(ctx)||changed;
    }

    if(!changed && moves.length>0){
        const move=moves.shift();
        const [i,j]=move.indices;
        const waveformType=move.swap?"square":"sine";
        playNote(cols[i].height+cols[j].height,waveformType);
        if(move.swap){
            cols[i].moveTo(cols[j]);
            cols[j].moveTo(cols[i],-1);
            [cols[i],cols[j]]=[cols[j],cols[i]];
        }else{
            cols[i].jump();
            cols[j].jump();
        }
    }

    requestAnimationFrame(animate);
}