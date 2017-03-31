function cssTransform(el, attr, val) {
	if (!el.transform) {
		el.transform = {};
	}
	if (arguments.length > 2) {
		el.transform[attr] = val;
		var sVal = "";
		for (var s in el.transform) {
			switch (s) {
				case "rotate":
				case "skewX":
				case "skewY":
					sVal += s + "(" + el.transform[s] + "deg) ";
					break;
				case "translateX":
				case "translateY":
				case "translateZ":
					sVal += s + "(" + el.transform[s] + "px) ";
					break;
				case "scaleX":
				case "scaleY":
				case "scale":
					sVal += s + "(" + el.transform[s] + ") ";
					break;
			}
			el.style.WebkitTransform = el.style.transform = sVal;
		}
	} else {
		val = el.transform[attr];
		if (typeof val == "undefined") {
			if (attr == "scale" || attr == "scaleX" || attr == "scaleY") {
				val = 1;
			} else {
				val = 0;
			}
		}
		return val;
	}
}

/* 封装ajax函数
 * @param {string}opt.type  http连接的方式，包括POST和GET两种方式
 * @param {string}opt.url  发送请求的url
 * @param {boolean}opt.async   是否为异步请求，true为异步的，false为同步的
 * @param {object}opt.data   发送的参数，格式为对象类型
 * @param {function}opt.success    ajax发送并接收成功调用的回调函数
 */

function ajax(opt) {
	opt = opt || {};
	opt.method = opt.method.toUpperCase() || 'POST';
	opt.url = opt.url || '';
	opt.async = opt.async || true;
	opt.data = opt.data || null;
	opt.success = opt.success || function() {};

	var xmlHttp = null;
	if (XMLHttpRequest) {
		xmlHttp = new XMLHttpRequest();
	} else {
		xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	var params = [];

	for (var key in opt.data) {
		params.push(key + '=' + opt.data[key]);
	}

	var postData = params.join('&');

	if (opt.method.toUpperCase() === 'POST') {
		xmlHttp.open(opt.method, opt.url, opt.async);
		xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
		xmlHttp.send(postData);
	} else if (opt.method.toUpperCase() === 'GET') {
		xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
		xmlHttp.send(null);
	}
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			opt.success(xmlHttp.responseText);
		}
	};
}

function getPos(obj) {
	var pos = {
		top: 0,
		left: 0
	};
	while (obj) {
		pos.top += obj.offsetTop;
		pos.left += obj.offsetLeft;
		obj = obj.offsetParent;
	}
	return pos;
}

function show(className) {
	var el = document.querySelector('.' + className);
	el.style.display = 'block';
}

function hide(className) {
	var el = document.querySelector('.' + className);
	el.style.display = 'none';
}

function $(className) {
	return document.querySelector('.' + className);
}

function $$(className) {
	return document.querySelectorAll('.' + className);
}

function createNode(tagName, opt) {
	return document.createElement(tagName);
}

function append(parent, dom) {
	parent.appendChild(dom);
}

function extend(target, obj) {
	for (var attr in obj) {
		if (obj[attr]) {
			target[attr] = obj[attr];
		}
	}
}