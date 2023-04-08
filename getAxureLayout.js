
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
        width_auto: (window.getComputedStyle(x.querySelector('div')).borderRightWidth=="0px")? true:false,
        height_auto: (window.getComputedStyle(x.querySelector('div')).borderBottomWidth=="0px")? true:false,
        innerText: x.textContent.trim(),
        parent: "app"
    }

}).sort((a, b) => { return (b.left+b.top) - (a.left+a.top) })
//从内到外排序，方便找父元素

for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; i < arr.length; j++) {
        console.log(i, j)
        if (isChild(arr[i], arr[j])) {
            arr[i]['parent'] = arr[j]['name']
            break
        }
    }
}


function getChildren(parentName) {
    return arr.filter(x => (x.parent === parentName)).sort((a, b) => {
        return ((a.left + a.top) - (b.left + b.top))
    })
    //子元素从左上到右下排
}

function getChildrenFlexdirection(parentName){
    
    let children = getChildren(parentName)

    if (parentName == 'main'){
        console.log(children);
    }

    if (children.length <=1){
        return "row"
    }else{
        return (children[0].top + children[0].height > children[1].top) ? "row":"column"
    }
}

function getNodeFlexdirection(node){
    return getChildrenFlexdirection(node.parent)
}

function getNode(node) {
    return arr.filter(x => (x.name == node))[0]
}

function isChild(child, parent) {
    return (child.left >= parent.left & child.left+child.width <= parent.left+parent.width &
        child.top >= parent.top & child.top +child.height <= parent.top+parent.height) ? true : false
}

function getLayoutDiv(name) {

    let node = getNode(name)
    if (node.length === 0) return ""

    let out_html = `<div class = "${node.name} box">\n`
    let children = getChildren(name)

    for (let i = 0; i < children.length; i++) {
        out_html += getLayoutDiv(children[i].name)
    }
    out_html += `</div>\n`
    return out_html
}

function get_css_style(){

   let main_css = arr.map(x=>{
        let flexdirection = getChildrenFlexdirection(x.name)
        let nodeflex = getNodeFlexdirection(x)
        let bflexgrow=false
        if (nodeflex =='row' & x.width_auto) bflexgrow = true
        if (nodeflex =='column' & x.height_auto) bflexgrow =true

        return `.${x.name} {
            ${x.width_auto? '' : 'width:' + x.width + 'px;'}
            ${x.height_auto? '' : 'height:' + x.height + 'px;'}
            ${bflexgrow? 'flex-grow:1;' : ''}
            flex-direction:${flexdirection};
            }`
   }).reverse().join('\n')
   return `<style> 
                *{padding:0px;margin:0px}
                .box{padding:3px; display:flex;border:1px solid red; box-sizing:border-box;}
                html,body {height:100%;}
                body{display:flex;}
                ${main_css}
            </style>`
}

function get_axure_layout() {
    let node = getChildren("app")[0]
    return {div:getLayoutDiv(node.name), css:get_css_style()}
}

let out = get_axure_layout()
console.log(out.div)
console.log(out.css)

