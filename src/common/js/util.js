/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
export function urlParse() {
	let url = window.location.search;
	let obj = {};
	let reg = /[?&][^?&]+=[^?&]+/g; // g是global的缩写啊！就是匹配全部可匹配结果，如果你不带g,在正则过程中，字符串是从左至右匹配的，如果匹配成功就不再继续向右匹配了，如果你带g,它会重头到尾的把正确匹配的字符串挑选出来
	let arr = url.match(reg); // 返回值是数组
	// ['?id=12345', '&a=b']
	if (arr) {
		arr.forEach((item) => {
			let tempArr = item.substring(1).split('='); // 去掉第一个字符（？或者&）然后把id和12345分开
			let key = tempArr[0];
			let val = decodeURIComponent(tempArr[1]);
			obj[key] = val;
		});
	}
	return obj;
};
