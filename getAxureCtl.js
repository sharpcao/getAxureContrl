function get_layout() {
let html_head = `
<html>
<head>
<style>
	* {
		padding:0px;
		margin:0px;
	}
	.ctldiv{
		position: absolute;
	}
	.ctldiv >:first-child {
		width:100%;
		height: 100%;
	}

</style>	
</head>
<body>
`
let html_footer =`
</body>
</html>
`

	let  convert_dict = {
		button: (x)=> {
			return `<div class = "ctlDiv" style = "left:${x.left};top:${x.top};width:${x.width};height:${x.height}"> `+
			`<button id = '${x.name}' > ${x.innerText}</button> </div>`

		},
		primary_button: (x)=> {
			return `<div class = "ctlDiv" style = "left:${x.left};top:${x.top};width:${x.width};height:${x.height}" >` +
			`<button id = '${x.name}'> ${x.innerText}</button> </div>`

		},
		radio_button: (x)=>{
			return `<div class = "ctlDiv" style = "left:${x.left};top:${x.top};width:${x.width};height:${x.height}"> `+
			`<div><input type="radio" id = "${x.name}" value="${x.innerText}" >${x.innerText} </div></div>`
		},
		checkbox: (x) => {
			return `<div class = "ctlDiv" style = "left:${x.left};top:${x.top};width:${x.width};height:${x.height}"> `+
			`<div><input type="checkbox" id = "${x.name}" value="${x.innerText}" >${x.innerText}</div></div>`

		},
		list_box:(x)=>{
			return `<div class = "ctlDiv" style = "left:${x.left};top:${x.top};width:${x.width};height:${x.height}">`+
			`<select id = "${x.name}" size = "2"> ${x.options}</select></div>`
		},
		droplist:(x)=>{
			return `<div class = "ctlDiv" style = "left:${x.left};top:${x.top};width:${x.width};height:${x.height}">`+
			`<select id = "${x.name}" size = "1" > ${x.options}</select></div>`
		},
		text_area: (x)=>{
			return `<div class = "ctlDiv" style = "left:${x.left};top:${x.top};width:${x.width};height:${x.height}">`+
			`<textarea id = '${x.name}' > ${x.innerText}</textarea></div>`

		},
		text_field: (x)=>{
			return `<div class = "ctlDiv" style = "left:${x.left};top:${x.top};width:${x.width};height:${x.height}"> `+
			`<input type="text" id = "${x.name}" value="${x.value}" ></div>`
		},
		paragraph: (x)=>{
			return `<div class = "ctlDiv" style = "left:${x.left};top:${x.top};width:${x.width};height:${x.height}">`+
			`<p id = '${x.name}' > ${x.innerText}</p> </div>`
		},
		label:(x)=>{
			return `<div class = "ctlDiv" style = "left:${x.left};top:${x.top};width:${x.width};height:${x.height}">`+
			`<label id = '${x.name}' > ${x.innerText}</label></div>`
		},
		image:(x)=>{
			return `<div class = "ctlDiv" style = "left:${x.left};top:${x.top};width:${x.width};height:${x.height}">`+
			`<img id = '${x.name}' src = '${x.src}'> </div>`
		}

	}


	let doc = document.querySelectorAll("[data-label]")
	let arr = Array.from(doc,x => {
			let computedStyle   =   window.getComputedStyle(x)
			let out = {
				id:x['id'],
				name:x.getAttribute('data-label'),
				class:x.getAttribute('class').split(' ')[1],
				left: computedStyle.left,
				top:computedStyle.top,
				width:computedStyle.width,
				height:computedStyle.height,
				innerText:x.textContent.trim()
			}
			if (out.class ==='text_field'){
				out['value'] = x.querySelector('input').value
			}
			if (out.class ==='list_box' |out.class ==='droplist' ){
				out['options'] = x.querySelector('select').innerHTML.trim()
			}
			if (out.class ==='image'){
				out['src'] = x.querySelector('img').src
			}
			return out 
		
		}
	)
	let properties = JSON.stringify(arr)
	let html_main = arr.map( x => {
		return Object.keys(convert_dict).includes(x.class)? convert_dict[x.class](x):null
	}).join("\n").trim()


	return (html_head + html_main + html_footer).trim()
} 

get_layout();

