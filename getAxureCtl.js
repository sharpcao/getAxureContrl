function get_layout() {
	let html_head = `
<html>
<head>
<style>
	* {
		padding:0px;
		margin:0px;
		font-size:12px;
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
	let html_footer = `
</body>
</html>
`
	function f_div_wrap(x, main) {
		return `<div class = "ctlDiv" style = "left:${x.left};top:${x.top};width:${x.width};height:${x.height}"> ${main} </div> `
	}

	let convert_dict = {
		button: (x) => f_div_wrap(x, `<button id = '${x.name}' > ${x.innerText}</button>`),
		primary_button: (x) => f_div_wrap(x, `<button id = '${x.name}'> ${x.innerText}</button>`),
		radio_button: (x) => f_div_wrap(x, `<div><input type="radio" id = "${x.name}" value="${x.innerText}" >${x.innerText}</div>`),
		checkbox: (x) => f_div_wrap(x, `<div><input type="checkbox" id = "${x.name}" value="${x.innerText}" >${x.innerText}</div>`),
		list_box: (x) => f_div_wrap(x, `<select id = "${x.name}" size = "2"> ${x.options}</select>`),
		droplist: (x) => f_div_wrap(x, `<select id = "${x.name}" size = "1" > ${x.options}</select>`),
		text_area: (x) => f_div_wrap(x, `<textarea id = '${x.name}' > ${x.innerText}</textarea>`),
		text_field: (x) => f_div_wrap(x, `<input type="text" id = "${x.name}" value="${x.value}" >`),
		paragraph: (x) => f_div_wrap(x, `<p id = '${x.name}' > ${x.innerText}</p>`),
		label: (x) => f_div_wrap(x, `<label id = '${x.name}' > ${x.innerText}</label>`),
		image: (x) => f_div_wrap(x, `<img id = '${x.name}' src = '${x.src}'>`),
		box_1: (x) => f_div_wrap(x, `<div id = '${x.name}' style="background-color:${x.background_color};display:flex"><div style="width:100%;align-self:center;text-align:center;">${x.innerText}</div></div>`),
		box_2: (x) => f_div_wrap(x, `<div id = '${x.name}' style="background-color:${x.background_color};display:flex"><div style="width:100%;align-self:center;text-align:center;">${x.innerText}</div></div>`),
		box_3: (x) => f_div_wrap(x, `<div id = '${x.name}' style="background-color:${x.background_color};display:flex"><div style="width:100%;align-self:center;text-align:center;">${x.innerText}</div></div>`)

	}


	let doc = document.querySelectorAll("[data-label]")
	let arr = Array.from(doc, x => {
		let computedStyle = window.getComputedStyle(x)
		let out = {
			id: x['id'],
			name: x.getAttribute('data-label'),
			class: x.getAttribute('class').split(' ')[1],
			left: computedStyle.left,
			top: computedStyle.top,
			width: computedStyle.width,
			height: computedStyle.height,
			innerText: x.textContent.trim()
		}
		switch (out.class) {
			case 'text_field':
				out['value'] = x.querySelector('input').value
				break;
			case 'list_box':
			case 'droplist':
				out['options'] = x.querySelector('select').innerHTML.trim()
				break;
			case 'image':
				out['src'] = x.querySelector('img').src
				break;
			case 'box_1':
			case 'box_2':
			case 'box_3':
				out['background_color'] = window.getComputedStyle(x.querySelector('div>:first-child')).backgroundColor

		}

		return out

	}
	)
	let properties = JSON.stringify(arr)
	let html_main = arr.map(x => {
		return Object.keys(convert_dict).includes(x.class) ? convert_dict[x.class](x) : null
	}).join("\n").trim()


	return (html_head + html_main + html_footer).trim()
}

get_layout();


