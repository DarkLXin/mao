
var loadLayer_Index;
var gdMp=null;
//var accidentLevel=null
var pointResults=null;
//周边搜索范围
var radius=1000;

var mySlider = null;

var searchPlaceMap={name:null,poi:null,radius:null};


$(document).ready(function () {
	
	$("#map").height($(window).height() - 9);

	//地图操作对象
	gdMp=new GDMap({mapDiv:"map",city_input:"search_keyword"});
	gdMp.init();
	
	//事故等级
	//accidentLevel=new AccidentLevel();
	//accidentLevel.show();
	
	//查询信息点结果对象
	pointResults=new PointResults();
	//pointResults.render();
	
	AMap.plugin('AMap.Autocomplete',function(){//回调函数
	    //实例化Autocomplete
		    var autoOptions = {
		        city: "", //城市，默认全国
		        input:"search_keyword"//使用联想输入的input的id
		    };
		    //TODO: 使用autocomplete对象调用相关功能
	    	var autocomplete= new AMap.Autocomplete(autoOptions);
	    	
	    	AMap.event.addListener(autocomplete,"select",function(e){
	    		var cityName=e.poi.district;
	    		var keyWord=e.poi.name;
	    		$("#city-picker").val(cityName);
	    		 searchPoi(cityName,keyWord);
	    	});
	    	
	   
	});
	
	$("#mapSearch_btn").click(function(){
		//var cityName=$.trim($("#city-picker").val());
		var keyword= $.trim($("#search_keyword").val());
		searchPoi("",keyword);
		
	});
	
	$("#search_keyword").on('change',function(event){
		var val=$.trim($(this).val());
		if(val==null || val==""){
			$("#city-picker").val("");
		}
	});

	mySlider = new Slider("#search_slider", {
		tooltip: 'always'
	}).on("slideStop",function(obj){
		auto_SearchPlace();
	});

	
	//浏览器加载完成
	window.onload=chagneMapHeight;
	
	//浏览器大小改变
	window.onresize=chagneMapHeight;

	$("#sendRoadRescue").click(function (){
		addRoadRescue();
	});
	
	


	

//	var params={"sessionId":"1114791505368732829"};
//	drawMapPathInfo(params,function(result){
//		console.log("返回轨迹1：");
//		console.log(result);
//		if(result.success && result.path!=null && result.path.length>0){
//			gdMp.showPathSimplifier(result);
//		}
//		
//	});
	

	
});

/**
 * 来电的时候 初始化地图和事故等级展示
 * callData  来电数据
 */
function initShowMapAndAccidentLevel(callData){
	console.log("-----来电初始化地图数据-----");
	console.log(callData);
	if(gdMp){
		gdMp.showCurrentLocation(callData);
	}

}

/**
 * 刷新视频
 */
function refishVideoList(){
	if(window.parent.PageUtil.callInfo.call_Data !=null){
		gdMp.addLoadVideoUI();
		setTimeout(function(){
			gdMp.findVideoList(window.parent.PageUtil.callInfo.call_Data.sessionId);
		},3000);
		
	}
}
//停止加载视频
function stopLoadVideo(){
	if(gdMp){
		gdMp.closeLoadVideoTime();
	}
}


/**
 * 点击误报按钮  取消视频接入
 */
function cancelRescue(){
	console.log("误报......");
	console.log(window.parent.PageUtil.callInfo.call_Data);
	if(window.parent.PageUtil.callInfo.call_Data !=null){
		loadLayer_Index=layer.msg('正在取消处理...', {
			  icon: 16,
			  time:5000,
			  shade: 0.01
		});
		var callInfo=window.parent.PageUtil.callInfo;
		window.parent.PageUtil.ivs.onCancelRescue(callInfo.call_Data.mobile,callInfo.IOSessionId,callInfo.call_Data.idCode,function(da){
			if(loadLayer_Index){
				layer.close(loadLayer_Index);
			}
			console.log("点击误报返回值");
			console.log(da);
			if(da && da.code=='NO_0000001'){
				window.parent.PageUtil.topWrapper.onDiscon_Event();//挂断状态
				gdMp.clearGdMap();//清除地图数据
				//清除来电数据
				window.parent.PageUtil.callInfo.clearCallInfo();
				window.parent.showSosTypeContext();
			}
		});
	}
	
}
/**
 * 点击呼叫车主接入视频
 */
function confirmRescue(){
	console.log("接入......");
	if(window.parent.PageUtil.callInfo.call_Data !=null){
		loadLayer_Index=layer.msg('正在请求连接...', {
			  icon: 16,
			  time:5000,
			  shade: 0.01
		});
		var callInfo=window.parent.PageUtil.callInfo;
		window.parent.PageUtil.ivs.onConfirmRescue(callInfo.call_Data.mobile,callInfo.IOSessionId,callInfo.call_Data.idCode,function(da){
			if(loadLayer_Index){
				layer.close(loadLayer_Index);
			}
			console.log("接入视频返回值");
			console.log(da);
			if(da && da.code=='NO_0000001'){
				window.parent.PageUtil.topWrapper.updateSeatStatus(window.parent.BaseData.seatStatusList.RESCUECONNECT.id);
				showHideRescueBtn();
				window.parent.PageUtil.callInfo.onWaitRescueConnect();
			}
		});
	}
	
	
}

//预警的时候 如果挂断电话 就隐藏显示救援接入操作按钮
function hideRescueBtnDiv(){
	if($("#rescue_btn_div")){
		$("#rescue_btn_div").hide();
	}
}


function showHideRescueBtn(){
	if($("#cancel_rescue_btn")){
		$("#cancel_rescue_btn").attr("disabled","disabled");
	}
	if($("#confirm_rescue_btn")){
		$("#confirm_rescue_btn").attr("disabled","disabled");
	}
	
}

//位置搜索
function searchPoi(cityName,keyword){
	console.log(cityName+"---"+keyword);
	$("#search_slider_div").hide();
	if(keyword!=null && keyword!=""){
		gdMp.mp_search(cityName,keyword,function(pois){
			pointResults.show(pois);
		});
	}else{
		//layer.alert("请选择城市！",{icon:2,title:['提示','text-align:left'],skin:'layui-layer-molv'});
	}
}

//周边搜索
function searchPlaceInfo(poi){
	var name=$.trim($("#search_place_input").val());
	if(name!=null && name!=""){
		$("#search_slider_div").show();
		var rad=mySlider!=null?mySlider.getValue():radius;
		searchPlaceMap.name=name;
		searchPlaceMap.poi=poi;
		searchPlaceMap.radius=rad;
		gdMp.mp_placeSearch(name,poi,rad,function(pois){
			pointResults.show(pois);
		});
	}else{
		layer.alert("请先输入周边搜索条件！",{icon:2,title:['提示','text-align:left'],skin:'layui-layer-molv'});
	}
}

//周边搜索 800米范围
function searchPlace(obj,poi){
	$("#search_slider_div").show();
	var rad=mySlider!=null?mySlider.getValue():radius;
	var txt=$(obj).text();
	searchPlaceMap.name=txt;
	searchPlaceMap.poi=poi;
	searchPlaceMap.radius=rad;
	gdMp.mp_placeSearch(txt,poi,rad,function(pois){
		pointResults.show(pois);
	});
}
//点击slider选择范围进行周边搜索
function auto_SearchPlace(){
	var rad=mySlider!=null?mySlider.getValue():radius;
	var name=searchPlaceMap.name;
	var poi=searchPlaceMap.poi;
	var rad1=searchPlaceMap.radius;
	if(name!=null && poi!=null && rad!=rad1){
		searchPlaceMap.radius=rad;
		gdMp.mp_placeSearch(name,poi,rad,function(pois){
			pointResults.show(pois);
		});
	}
}




function chagneMapHeight(){
	var h=document.documentElement.clientHeight-9;//可见区域高度
	document.getElementById("map").style.height=h+"px";
}


function showPoiResult(index){
	console.log("点击信息点在地图上面显示.......");
	console.log(index);
	var poi=pointResults.getPoi(index);
	gdMp.showAddress(poi);

}



/**
 * 直接将设置的信息点下发出去
 * @param poiComm
 */
function sendInfoByPoiComm(poiComm){
	console.log(poiComm);
	layer.confirm("确定发送?", {icon: 3,skin: 'layui-layer-molv', btn: ['确定','取消']},function(index){
		layer.close(index);
		var poi={"location":{"lat":poiComm.posX,"lng":poiComm.posY},"name":poiComm.content,"address":poiComm.content_Info};
		sendInfo(poi);
		
	});
	
	
}


//发送信息点
function sendInfo(poi){
	//var navigateMode = $('input:radio[name="radio"]:checked').val(); //导航方式
	//console.log(navigateMode);
	var navigateMode=0;
	try{
		gdMp.getProvinceCity(poi.location.lng,poi.location.lat,function(result){
			poi["cityName"]=result;
			console.log(poi);
			window.parent.PageUtil.gdMapSend(navigateMode,poi);
		});
	}catch (e) {
		window.parent.PageUtil.gdMapSend(navigateMode,poi);
	}
}

/**
 * 常用信息点设置
 * @param poi
 */
function savePoiCommonInfo(contentType,poi){
	////var contentType=$('div [class="pull-right"]>select').val();
	console.log(contentType+"-------");
	layer.confirm("确定设置？", {icon: 3,skin: 'layui-layer-molv', btn: ['确定','取消']},function(index){
		layer.close(index);
		if(contentType!=null && contentType!==""){
			if(window.parent.PageUtil){
				window.parent.PageUtil.savePoiCommon(contentType,poi);
			}
		}else{
			layer.alert("请选择地点类型！",{icon:2,title:['提示','text-align:left'],skin:'layui-layer-molv'});
		}
		
	});
	
	
}



/**
 * 保存操作记录
 */
function saveScheduleInfo(content){
	
	window.parent.PageUtil.saveCurrentSchedule(content);
}


/**
 * 急救指导
 */
function guideWin(){
	
	layer_confirm("确认联系医生？",function(){
		saveScheduleInfo("联系医生进行急救指导");
		layer_alert("已为您联系医生");
	});
	
}
/**
 * 联系家人
 * @param obj
 */
function familyWin(obj){
	var phone=$.trim($(obj).nextAll(".p-detail").find("input").val());
	if(phone && typeof(phone)!="undefined"){
		layer_confirm("确认联系家人【"+phone+"】？",function(){
			saveScheduleInfo("联系客户家人,电话号码："+phone);
			layer_alert("已为您联系家人");
			
		});
	}else{
		layer_alert("请输入联系人电话号码!");
	}

}
/**
 * 联系保险
 */
function insureWin(){
	layer_confirm("确认联系保险公司？",function(){
		saveScheduleInfo("联系保险公司进行赔付处理");
		layer_alert("已为您联系保险");
	});
	
}
/**
 * 联系交警
 */
function policeWin(){
	layer_confirm("确认联系交警？",function(){
		saveScheduleInfo("联系交警到现场进行事故处理");
		layer_alert("已为您联系交警");
	});
}

/**
 * 道路救援
 */
function rescueWin(rescueType){
	   var callData = window.parent.PageUtil.callInfo.call_Data;
	   if(null != callData){
		   parent.layer_iframe_show("新增救援单","rescue/add.html?rescueType="+rescueType,700,620);
	   }
}


/**
 * 查询信息点结果对象
 * @param config
 * @returns
 */
var PointResults=function(config){
	config=config || {};
	this.xcList=config.xcList || "xcList";
	this.renderId=config.renderId || "pointResultDiv";
	this.pointResultTmpl="pointResult_tmpl";
	this.poisList=[];
	
	this.getPoi=function(index){

		var poi=null;
		if(index==null || index<0){
			index=0;
		}
		if(this.poisList!=null && this.poisList.length>index){
			poi=this.poisList[index];
		}
		return poi;
	}
	
	this.show=function(datas){
		this.poisList=datas;
		//console.log(datas);
		if(datas && datas.length>0){
			var part=this;
			$("#"+this.renderId).empty();
			$.each(datas,function(index,data){

				data.index=index+1;
				data.distance=(data.distance==null || data.distance==NaN)?0:data.distance;
				$("#"+part.pointResultTmpl).tmpl(data).appendTo("#"+part.renderId);
			});
			$("#"+this.xcList).show();
		}else{
			//$("#"+this.renderId).html("没有搜索到相关记录");
			//$("#"+this.xcList).show();
			$("#"+this.xcList).hide();
			//layer.alert("没有搜索到相关记录！",{icon:2,title:['提示','text-align:left'],skin:'layui-layer-molv'});
		}
	}
}

/**
 * 根据sessionId查询轨迹
 * @param sessionId
 */
function startDrawPath(sessionId){
	if(sessionId!=null && sessionId!=""){
		var params={"sessionId":sessionId};
		//获取times
		drawMapPathInfo(params,function(result){
			console.log("查询轨迹返回数据");
			console.log(result);
			if(result.success && result.path!=null && result.path.length>0){
				gdMp.showPathSimplifier(result);
			}
		});
	}
}
//点击加载轨迹
function loadDrawPath(params){
	if(params && params.sessionId){
		drawMapPathInfo(params,function(result){
			console.log("返回轨迹2：");
			console.log(result);
			if(result.success && result.path!=null && result.path.length>0){
					gdMp.addPathNaviSimpl(result);
			}
		});
	}
	
}



/**
 * 绘制轨迹
 * params:{sessionId:"",beginTimes:"",endTimes:""}
 */
function drawMapPathInfo(params,fn){
	//var tipIndex = layer.msg("正在更新客户数据...",{icon: 16,shade: 0.2,time:30000});
	$.ajax({
		url: request_url+'/gpsInfo/getGpsInfoListBySessionId.do',
		type: 'POST',
		timeout: 30000,
		async:false,
		cache:false, 
		data:params , 
		dataType:"json",
		success:function(result){
			if (fn && typeof fn === "function"){
				fn(result);
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			errorExcepHandler(xhr, textStatus, errorThrown);
		}
	});
		
}

