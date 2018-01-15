$(function (){  

	
	var id = getUrlParam("id");
	$("#id").val(id);
	if(id && id!=null){
		findInfo(id);
	}
	
	 $("#submitBtn").click(function(){
		 beforeSumit();
     });
});

function findInfo(id){
	if(id!=null && id!=""){
		var l_index = parent.layer.load();//启动加载动画
		$.ajax({
			async:false,
			type:'POST',
	        url: '../mao/product/get.do',
	        data:{"id":id},
			dataType: 'json',
			cache:false,
			success: function(result){
	 		   parent.layer.close(l_index);//关闭加载动画
	 		   if(result.success){
	 			  loadForm(result.data);
	 		   }else{
	 			  parent.layer_msg_b(result.message);
	 		   }
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
			    //这个error函数调试时非常有用，如果解析不正确，将会弹出错误框
				parent.layer.close(l_index);//关闭加载动画
	   			parent.layer_msg_b("系统错误!");
			}
		});
	}else{
		parent.layer_msg_b("ID为空,无法获取数据!");
	}
}



function loadForm(data){
	if(data && data!=null){
		$("#id").val(data.id);
		$("#name").val(data.name);
		$("#price").val(data.price);
		$("#remark").val(data.remark);
		$("#pic").val(data.pic);
	}

}


function beforeSumit(){
	var params = $("#Form").serializeObject();
	
	if(!params.name || params.name==null || $.trim(params.name)==""){
		layer_alert("名称不能为空!");
		return;
	}
	
	if(!params.price || params.price==null || $.trim(params.price)==""){
		layer_alert("价格不能为空!");
		return;
	}
	
	doSubmit(params);
}


function doSubmit(params){
    var l_index = parent.layer.load();//启动加载动画
	$.ajax({
		async:false,
		type:'POST',
        url: '../mao/product/save.do',
        data:params,
		dataType: 'json',
		cache:false,
		success: function(result){
 		   parent.layer.close(l_index);//关闭加载动画
 		   if(result.success){
 			  parent.layer_msg_b("操作成功!");
 			  parent.currIframe.contentWindow.search();//刷新刷新父窗口
 		      parent.layer_iframe_close();//关闭iframe窗口
 		   }else{
 			  parent.layer_msg_b(result.message);
 		   }
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
		    //这个error函数调试时非常有用，如果解析不正确，将会弹出错误框
			parent.layer.close(l_index);//关闭加载动画
   			parent.layer_msg_b("系统错误!");
    }
});
}