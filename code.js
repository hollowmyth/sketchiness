
const mySelection = figma.currentPage.selection;
const firstType = mySelection[0].type;
var wiggle = 3;
if (firstType === "FRAME") {
    var myFrame = mySelection[0];
    const squarenodes = myFrame.findAll(node => node.type === "RECTANGLE");
    const trianglenodes = myFrame.findAll(node => node.type === "TRIANGLE");
    const polygonnodes = myFrame.findAll(node => node.type === "POLYGON");
    const starnodes = myFrame.findAll(node => node.type === "STAR");
    const vectornodes = myFrame.findAll(node => node.type === "VECTOR");
    var rectnodes = squarenodes.concat(polygonnodes);
    rectnodes = rectnodes.concat(starnodes);
    rectnodes = rectnodes.concat(vectornodes);
    console.log(rectnodes);
    //var flatNodes = figma.flatten(rectnodes,mySelection);
    //console.log(flatNodes);
    for (let n=0;n < rectnodes.length;n++) {
        console.log(rectnodes[n]);
        var rectnode = figma.flatten([rectnodes[n]],myFrame);
        //var rectnode = flatNodes[n];
        console.log(rectnode);
        sketchMost(rectnode);
    }
    const ellipsenodes = myFrame.findAll(node => node.type === "ELLIPSE");
    console.log(ellipsenodes);
    //var flatCircles = figma.flatten(ellipsenodes,mySelection,0);
    for (let p=0;p < ellipsenodes.length;p++) {
        var ellipsenode = figma.flatten([ellipsenodes[p]],myFrame);
        //var ellipsenode = flatCircles[p];
        sketchEllipse(ellipsenode);
    }
} else {
    var rectnodes = mySelection;
    console.log(mySelection);
    var myParent = mySelection[0].parent;
    for (let q=0;q < mySelection.length;q++) {
        console.log(mySelection[q]);
        var myType = mySelection[q].type;
        if (myType === "RECTANGLE" || myType === "TRIANGLE" || myType === "POLYGON" || myType === "VECTOR") {
            var rectnode = figma.flatten([mySelection[q]],myParent);
            sketchMost(rectnode);
        } else if (myType === "ELLIPSE") {
            var enode = figma.flatten([mySelection[q]],myParent);
            sketchEllipse(enode);
        }
    }
}
//     var ellipsenode = figma.flatten([mySelection],mySelection.parent,0);
//     //sketchEllipse(thing);
//     var circleData = ellipsenode.vectorPaths[0].data;
//     var circleDataArray = circleData.split('C');
//     for (let i=1;i<circleDataArray.length;i++){
//         var numArray = circleDataArray[i].split(' ');
//         numArray = numArray.filter(item => item);
//         for (let t=0;t<numArray.length;t++){
//             var tempNum = numArray[t];
//             numArray[t] = tempNum + (wiggle *  (Math.round(Math.random()) ? 1 : -1));
//         }
//         circleDataArray[i] = 'C ' + numArray.join(' ');
//     }
//     var finalData = circleDataArray.join(' ');
//     console.log('ellipse finalData: ' + finalData);
//     ellipsenode.vectorPaths = [{
//         windingRule: ellipsenode.vectorPaths[0].windingRule,
//         data: finalData
//     }]
// } else if (myType === "RECTANGLE" || myType === "TRIANGLE" || myType === "POLYGON" || myType === "VECTOR") {
//     //var thing = figma.flatten([mySelection], mySelection.parent,0);
//     //sketchRect(thing);
// }


function sketchMost(rectnode) {
    var rectData = rectnode.vectorPaths[0].data;
    console.log(rectData);
    var rectDataArray = rectData.split('L');
    var rectDataArrayClean = [];
    for (let i=1;i<rectDataArray.length;i++){
        var prevPoint;
        if (i == 1) {
            prevPoint = "0 0";
            rectDataArrayClean.push("0 0");
        } else {
            prevPoint = rectDataArrayClean[i-1];
        }
        console.log(rectDataArrayClean);
        console.log("rectdata clean i-1:" + rectDataArrayClean[i-1]);
        var prevPointArray = prevPoint.split(' ');
        var numArray = rectDataArray[i].split(' ');
        numArray = numArray.filter(item => item);
        rectDataArrayClean.push(numArray.join(' '));
        var distx = parseInt(numArray[0] - parseInt(prevPointArray[0]));
        var disty = parseInt(numArray[1] - parseInt(prevPointArray[1]));
        var totDist = Math.sqrt((distx * distx) + (disty * disty));
        if (totDist >= 100) {
            var smDist1 = Math.floor(totDist * 0.3);
            var smDist2 = Math.floor(totDist * 0.7);
            var ratio1 = smDist1 / totDist;
            var ratio2 = smDist2 / totDist;
            var smDist1XLen = distx * ratio1;
            var smDist1YLen = disty * ratio1;
            var smDist2XLen = distx * ratio2;
            var smDist2YLen = disty * ratio2;
            var smX1 = parseInt(prevPointArray[0]) + smDist1XLen;
            var smY1 = parseInt(prevPointArray[1]) + smDist1YLen;
            var smX2 = parseInt(prevPointArray[0]) + smDist2XLen;
            var smY2 = parseInt(prevPointArray[1]) + smDist2YLen;
            var bub = {
                "totDist":totDist,
                "distx":distx,
                "disty":disty,
                "smDist1":smDist1,
                "smDist2":smDist2,
                "ratio1":ratio1,
                "ratio2":ratio2,
                "smDist1XLen":smDist1XLen,
                "smDist1YLen":smDist1YLen,
                "smX1":smX1,
                "smY1":smY1
            }
            console.log(bub);
            var newDataString = "L " + (smX1 + wiggle) + " " + (smY1 + wiggle) + " L " + (smX2 + wiggle) + " " + (smY2 - wiggle) + " L " + rectDataArray[i];
            rectDataArray[i] = newDataString;
        } else {
            var smDist = Math.floor(totDist * 0.5);
            var ratio1 = smDist / totDist;
            var smDistXLen = distx * ratio1;
            var smDistYLen = disty * ratio1;
            var smX = parseInt(prevPointArray[0]) + smDistXLen;
            var smY = parseInt(prevPointArray[1]) + smDistYLen;
            wiggle = (wiggle *  (Math.round(Math.random()) ? 1 : -1));
            newDataString = "L " + (smX + wiggle) + " " + (smY + wiggle) + " L " + rectDataArray[i];
            rectDataArray[i] = newDataString;
        }
    }
    var finalData = rectDataArray.join(' ');
    finalData = finalData.replace(/\s{2,}/g, ' ');
    console.log('finalData: ' + finalData);
    rectnode.vectorPaths = [{
        windingRule: rectnode.vectorPaths[0].windingRule,
        data: finalData
    }]
}

function sketchEllipse(ellipsenode) {
    var circleData = ellipsenode.vectorPaths[0].data;
    var circleDataArray = circleData.split('C');
    for (let i=1;i<circleDataArray.length;i++){
        var numArray = circleDataArray[i].split(' ');
        numArray = numArray.filter(item => item);
        console.log("inside ellipse numArray: ", numArray);
        for (let t=0;t<numArray.length;t++){
            if (numArray[t] !== "Z") {
                var tempNum = parseInt(numArray[t]);
                numArray[t] = tempNum + (wiggle *  (Math.round(Math.random()) ? 1 : -1));
            }
        }
        circleDataArray[i] = 'C ' + numArray.join(' ');
    }
    var finalData = circleDataArray.join(' ');
    finalData = finalData.replace(/\s{2,}/g, ' ');
    console.log('ellipse finaldata: ' + finalData);
    ellipsenode.vectorPaths = [{
        windingRule: ellipsenode.vectorPaths[0].windingRule,
        data: finalData
    }]
}
//data: "M 0 0 L 208 0 L 208 62 L 0 62 L 0 0 Z"
// function sketchRect(rectnode) {
    
// }
// function sketchEllipse(ellipsenode) {
    
// }
// function sketchVector(vectornode) {

// }


// const nodes = [];
// for (let i = 0; i < msg.count; i++) {
//     const rect = figma.createRectangle();
//     rect.x = i * 150;
//     rect.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0, b: 1 } }];
//     figma.currentPage.appendChild(rect);
//     nodes.push(rect);
// }
// figma.currentPage.selection = nodes;
// figma.viewport.scrollAndZoomIntoView(nodes);
//}
// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
figma.closePlugin();
