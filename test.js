const mySelection = figma.currentPage.selection[0];
const myType = mySelection.type;
if (myType === "FRAME") {
    const rectnodes = mySelection.findAll(node => node.type === "RECTANGLE");
    //const ellipsenodes = mySelection.findAll(node => node.type === "ELLIPSE");
    //const trianglenodes = mySelection.findAll(node => node.type === "TRIANGLE");
    var flatNodes = figma.flatten(rectnodes,mySelection,0);
    for (let n=0;n < flatNodes.length;n++) {
        var myNode = flatNodes[n];
        sketchRect(myNode);
    }
} else if (myType === "ELLIPSE") {
    var thing = figma.flatten([mySelection],mySelection.parent,0);
    sketchEllipse(thing);
} else if (myType === "RECTANGLE" || myType === "TRIANGLE" || myType === "POLYGON" || myType === "VECTOR") {
    var thing = figma.flatten([mySelection], mySelection.parent,0);
    sketchRect(thing);
}

//data: "M 0 0 L 208 0 L 208 62 L 0 62 L 0 0 Z"
function sketchRect(rectnode) {
    var rectData = rectnode.vectorPaths.data;
    var rectDataArray = rectData.split('L');
    for (let i=1;i<rectDataArray.length;i++){
        var prevPoint;
        if (i == 1) {
            prevPoint = "0 0";
        } else {
            prevPoint = rectDataArray[i-1];
        }
        var prevPointArray = prevPoint.split(' ');
        var numArray = rectDataArray[i].split(' ');
        distx = numArray[0] - prevPointArray[0];
        disty = numArray[1] - prevPointArray[1];
        totDist = Math.sqrt((distx * distx) + (disty * disty));
        if (totDist >= 100) {
            smDist1 = Math.floor(totDist * 0.3);
            smDist2 = Math.floor(totDist * 0.7);
            var ratio1 = smDist1 / totDist;
            var ratio2 = smDist2 / totDist;
            smDist1XLen = distx * ratio1;
            smDist1YLen = disty * ratio1;
            smDist2XLen = distx * ratio2;
            smDist2YLen = disty * ratio2;
            smX1 = prevPointArray[0] + smDist1XLen;
            smY1 = prevPointArray[1] + smDist1YLen;
            smX2 = prevPointArray[0] + smDist2XLen;
            smY2 = prevPointArray[1] + smDist2YLen;
            newDataString = "L " + (smX1 + wiggle) + " " + (smY1 + wiggle) + " L " + (smX2 + wiggle) + " " + (smY2 - wiggle) + " L " + rectDataArray[i];
            rectDataArray[i] = newDataString;
        } else {
            smDist = Math.floor(totDist * 0.5);
            var ratio1 = smDist / totDist;
            smDistXLen = distx * ratio1;
            smDistYLen = disty * ratio1;
            smX = prevPointArray[0] + smDistXLen;
            smY = prevPointArray[1] + smDistYLen;
            wiggle = (wiggle *  (Math.round(Math.random()) ? 1 : -1));
            newDataString = "L " + (smX + wiggle) + " " + (smY + wiggle) + " L " + rectDataArray[i];
            rectDataArray[i] = newDataString;
        }

        

        // for (let t=0;t<numArray.length;t++){
        //     tempNum = numArray[t];
        //     numArray[t] = tempNum + (wiggle *  (Math.round(Math.random()) ? 1 : -1));
        // }
        //circleDataArray[i] = 'L ' + numArray.join(' ');
    }
    var finalData = rectDataArray.join(' ');
    rectnode.vectorPaths = [{
        windingRule: rectnode.vectorPaths.windingRule,
        data: finalData
    }]
}
function sketchEllipse(ellipsenode) {
    var circleData = ellipsenode.vectorPaths.data;
    var circleDataArray = circleData.split('C');
    for (let i=1;i<circleDataArray.length;i++){
        var numArray = circleDataArray[i].split(' ');
        for (let t=0;t<numArray.length;t++){
            tempNum = numArray[t];
            numArray[t] = tempNum + (wiggle *  (Math.round(Math.random()) ? 1 : -1));
        }
        circleDataArray[i] = 'C ' + numArray.join(' ');
    }
    var finalData = circleDataArray.join(' ');
    ellipsenode.vectorPaths = [{
        windingRule: ellipsenode.vectorPaths.windingRule,
        data: finalData
    }]
}
function sketchVector(vectornode) {

}

for (const node of figma.currentPage.selection) {
  const rectnodes = node.findAll(node => node.type === "RECTANGLE");
  console.log(rectnodes);
  const mynodes = [polynode];
  figma.flatten(mynodes,polynode.parent,0);
  const polynode2 = node.findOne(node => node.type === "VECTOR");
  console.log(polynode2);
  const oldData = polynode2.vectorPaths;
  console.log(oldData);
  const newData = [{
    windingRule: oldData[0].windingRule,
    data: "M 0 100 L 100 100 L 50 0 Z",
  }]
  polynode2.vectorPaths = newData;
}


const arc3 = figma.createVector()

// This creates a triangle
arc3.strokes = [{
    blendMode:"NORMAL",
    color:{r:0,g:0,b:0},
    opacity:1,
    type:"SOLID",
    visible:true
}]
arc3.strokeWeight = 3;
arc3.vectorPaths = [{
  windingRule: 'EVENODD',
  data: 'M 200 100 C 200 155.23 155.23 200 100 200',
}]
figma.currentPage.appendChild(arc3)

const wiggle = 3;
const newData = 'M ' + (200 + wiggle) + ' 100 C ' + (200 - wiggle) + ' ' + (155.23 + wiggle) + ' ' + (155.23 - wiggle) + ' ' + (200 - wiggle) + ' 100 ' + (200 + wiggle);
console.log(newData);
arc3.vectorPaths = [{
    windingRule:'EVENODD',
    data: newData
}]

//get the data

//split it on M, C, L



const wiggle = 3;
var circleData = "M 200 100 C 200 155.22847366333008 155.22847366333008 200 100 200 C 44.77152633666992 200 0 155.22847366333008 0 100 C 0 44.77152633666992 44.77152633666992 0 100 0 C 155.22847366333008 0 200 44.77152633666992 200 100 Z"
var circleDataArray = circleData.split('C');
for (let i=0;i<circleDataArray.length;i++){
    if (i > 0) {
        var numArray = circleDataArray[i].split(' ');
        for (let t=0;t<numArray.length;t++){
            tempNum = numArray[t];
            numArray[t] = tempNum + (wiggle *  (Math.round(Math.random()) ? 1 : -1));
        }
        circleDataArray[i] = 'C ' + numArray.join(' ');
    }
}
