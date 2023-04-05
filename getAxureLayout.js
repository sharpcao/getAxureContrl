let doc = document.querySelectorAll("[data-label]")
let arr  = Array.from(doc, x=>{
     let computedStyle = window.getComputedStyle(x)
     return {
            id: x['id'],
            name: x.getAttribute('data-label'),
            class: x.getAttribute('class').split(' ')[1],
            left: parseInt(computedStyle.left),
            top: parseInt(computedStyle.top),
            width: parseInt(computedStyle.width),
            height: parseInt(computedStyle.height),
            innerText: x.textContent.trim(),
            parent:"app"
        }

}).sort((a,b)=>{ return parseInt(b.left) - parseInt(a.left) })


for (let i = 0; i < arr.length-1; i++) {
    for (let j = i+1; i < arr.length; j++) {
        console.log(i,j)
        if (isChild(arr[i],arr[j])){
            arr[i]['parent'] = arr[j]['name']
            break
        }
    }
}


function getChildren(parentName=""){
    return arr.filter(x=>(x.parent===parentName))
}
function getNode(node){
    return arr.filter(x=>(x.name==node))[0]
}

function isChild(child,parent){
    return (child.left > parent.left & child.width < parent.width & 
        child.top > parent.top & child.height < parent.height) ? true:false
}

function getLayoutDiv(name){

    let node = getNode(name)
    if (node.length === 0) return ""

    let out_html = `<div id = "${node.name}">\n`

    let children = getChildren(name)

    for (let i = 0; i < children.length; i++) {
        out_html += getLayoutDiv(children[i].name)
    }
    out_html += `</div>\n`
    return out_html
}
function get_axure_layout()
{
    let node = getChildren("app")[0]
    return getLayoutDiv(node.name)
}

get_axure_layout()
