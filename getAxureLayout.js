let doc = document.querySelectorAll("[data-label]")
let arr = Array.from(doc, x => {
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
        parent: "app"
    }

}).sort((a, b) => { return parseInt(b.left) - parseInt(a.left) })


for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; i < arr.length; j++) {
        console.log(i, j)
        if (isChild(arr[i], arr[j])) {
            arr[i]['parent'] = arr[j]['name']
            break
        }
    }
}


function getChildren(parentName = "") {
    return arr.filter(x => (x.parent === parentName)).sort((a, b) => {
        return Math.min(a.left + a.top, b.left + b.top)
    })
}

function getNode(node) {
    return arr.filter(x => (x.name == node))[0]
}

function isChild(child, parent) {
    return (child.left > parent.left & child.left+child.width < parent.left+parent.width &
        child.top > parent.top & child.top +child.height < parent.top+parent.height) ? true : false
}

function getLayoutDiv(name) {

    let node = getNode(name)
    if (node.length === 0) return ""

    let out_html = `<div id = "${node.name}" class="box">\n`

    let children = getChildren(name)

    for (let i = 0; i < children.length; i++) {
        out_html += getLayoutDiv(children[i].name)
    }
    out_html += `</div>\n`
    return out_html
}
function get_css_style(){

   let main_css = (arr.map(x=>{
        return `#${x.name} {
            width:${x.width}px;
            height:${x.height}px;
            }`
   }).reverse()).join('\n')
   return `<style> \n*{padding:0px;margin:0px} .box{padding:3px; 
   border:1px solid red; box-sizing:border-box;} \n` + main_css + `\n</style>`
}

function get_axure_layout() {
    let node = getChildren("app")[0]
    return {div:getLayoutDiv(node.name), css:get_css_style()}
}

get_axure_layout()