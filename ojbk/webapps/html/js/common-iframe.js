/* =========================================================
 * iframe嵌套的子页面公共JS
 * ========================================================= */

/*获取URL上的参数*/
function getParamString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
/*初始化表格高度，兼容屏幕*/
function initTableHeight(obj,h) {
	h=h || 220;
	var height_t = $(window).height() - h;
    if(height_t > 630){
    	height_t = 630;
    }
    obj.setGridHeight(height_t);
}

function bindNavGrid(tableList,pageList){
    $("#"+tableList).jqGrid("navGrid", "#"+pageList, {
        edit: false,
        add: false,
        del: false,
        search: false
    }, {
        reloadAfterSubmit: true
    });
}

function bindResize(tableList,wrapper){
	 $(window).bind("resize", function() {
         var width = $("."+wrapper).width();
         $("#"+tableList).setGridWidth(width);
     });
}

/*时间格式化*/
Date.prototype.Format = function (fmt) { //new Date(timestamp).Format("yyyy-MM-dd hh:mm:ss")
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}