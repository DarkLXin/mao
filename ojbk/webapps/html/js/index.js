function logout() {
	layer_confirm("确定要退出吗？", function() {
		if(PageUtil.ivs){
			PageUtil.ivs.onCloseConnect();
		}
		$.get(request_url+"/logout.do", function(data) {
			window.location.href = "login.html";
		});
	});
}

function changePassword() {
	layer_iframe_show('更改密码', 'unicom/layer_changePwd.html', '800', '320');
}

function jumpTo(){
	$("#map_page").attr("src", "save.html?rescueType=LIFE");
}

function jumpToDetail(id){
	//$("#map_page").attr("src", "saveDetail.html");
	layer_iframe_show('救援详情', 'rescue/ym/saveDetail.html?id='+id, '860', '650');
}