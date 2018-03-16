export function formatDate(date, fmt) {
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	};
	for (let k in o) {
		if (new RegExp(`(${k})`).test(fmt)) { // (${k})为啥加括号？匹配 'x' 并且记住匹配项，括号被称为 捕获括号。因为后面的RegExp.$1要获取被捕获的字符串，所以要先记住
			let str = o[k] + ''; // 点表示法的对象的属性名是标识符，而后者的属性名则是一个字符串，如： object.property，object['property']
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
		}
	}
	return fmt;
};

function padLeftZero(str) {
	return ('00' + str).substr(str.length);
}
