/**
 * 高德地图操作对象
 * @param {Object} config
 */
var GDMap=function(config){
	config=config||{};
	this.mapDiv=config.mapDiv || "map";
	this.mp=null;
	this.myPathSimplifierInfo=null;
	this.mpZoom=15;//地图缩放级别
	this.poiPageSize=10;//搜索信息点的数量
	this.placeSearch=null;
	this.infoWindow=null;
	this.markerList={};
	//默认为深圳坐标
	this.lng=config.lng || 114.085947;
	this.lat=config.lat || 22.547;
	this.city_input=config.city_input || null;
	this.isVideoLoad=false;//视频是否加载完成
	this.videoLoadTimeId=null;//视频加载计时器ID
	
	this.getInfoWindow=function(){
		if(this.infoWindow==null){
			this.infoWindow = new AMap.InfoWindow({
			        autoMove: true,
			        offset: {x: 0, y: -30}
			});
		}
		return this.infoWindow;
	};
	
	this.getPlaceSerch=function(){
		if(this.placeSearch==null){
			this.placeSearch=new AMap.PlaceSearch({
			 		pageSize:this.poiPageSize,
		            pageIndex:1,
		            city:'' //城市编码
			});
		}
		return this.placeSearch;
	};
	
	this.init=function(){
		var part=this;
     
		this.mp = new AMap.Map(this.mapDiv, {
	    	resizeEnable: true,
	    	zoom:this.mpZoom, 
	    	center: [this.lng, this.lat]
		});
		AMap.plugin(['AMap.ToolBar','AMap.Scale','AMap.OverView'],function(){
			//part.mp.addControl(new AMap.ToolBar());

			part.mp.addControl(new AMap.Scale());

			part.mp.addControl(new AMap.OverView({isOpen:true}));
		});
		//this.initCity();

	};
	
	//隐藏轨迹
	this.hidePathSimplifier=function(){
		if(this.myPathSimplifierInfo){
			this.myPathSimplifierInfo.hide(); 
		}
		
	};
	//显示轨迹(初始方法)
	this.showPathSimplifier=function(data){
		//data={name:'name',path:[[经度longitude,纬度latitude],[113.938233,22.564660]]}
		if(data!=null && data.path && jQuery.isArray(data.path)){
			var part=this;
			AMapUI.load(['ui/misc/PathSimplifier'], function(PathSimplifier) {
				 if (!PathSimplifier.supportCanvas) {
				    	console.log("当前环境不支持 Canvas!");
				        return;
				    }
				
				 var myPathSimplifierInfo=part.getPathSimplifierIns(PathSimplifier);
				 
				 
				 myPathSimplifierInfo.setData([data]);
				
				 part.addOnPointClickListener(myPathSimplifierInfo);
				 
				 part.getPathNavi(myPathSimplifierInfo,0,PathSimplifier).start();
				 
				 myPathSimplifierInfo.show();
			});
		}
	};
	
	this.getPathSimplifierIns=function(PathSimplifier){
		if(!this.myPathSimplifierInfo || this.myPathSimplifierInfo==null){
			this.myPathSimplifierInfo = new PathSimplifier({
		        zIndex: 100,
		        map: this.mp, //所属的地图实例
		        getPath: function(pathData, pathIndex) {
		            //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
		            return pathData.path;
		        },
		        getHoverTitle: function(pathData, pathIndex, pointIndex) {
		        	var datas=pathData.datas;
		            //返回鼠标悬停时显示的信息
		            if (pointIndex >= 0) {
		                //鼠标悬停在某个轨迹节点上
		            	var speed=datas[pointIndex].speed || 0;
		            	var time=datas[pointIndex].time || "";
		            	return "轨迹点："+(pointIndex+1)+"/"+pathData.path.length+"<br/>" +
		            			"速度：<span style='color:red'>"+speed+" km/h</span><br/>"+
		            			"时间："+time;
		            	
		               // return pathData.name + '，点:' + (pointIndex+1) + '/' + pathData.path.length;
		            }
		            //鼠标悬停在节点之间的连线上
		            //return pathData.name + '，点数量' + pathData.path.length;
		        },
		        renderOptions: {
		            //轨迹线的样式
		            pathLineStyle: {
			            strokeStyle: 'red',
			            lineWidth: 6,
			            dirArrowStyle: true
		            }
		        },
		        renderOptions:{
		        	keyPointTolerance:0,
		        	renderAllPointsIfNumberBelow:100
		        }
			});	
			
		}
		return this.myPathSimplifierInfo;
		
	};
	
	//添加事件
	this.addOnPointClickListener=function(myPathSimplifierInfo){
		if(myPathSimplifierInfo){
			var part=this;
			myPathSimplifierInfo.on('pointClick', function(e, info){
			
				var pathData=info.pathData;
				var pointIndex=info.pointIndex;
				if(pathData.path.length==(pointIndex+1)){
					var data=pathData.datas[pointIndex];
					console.log(data);
					part.searchPathSimplifier();
				}
			 });
		}
		
	};
	
	////创建一个巡航器
	this.getPathNavi=function(myPathSimplifierInfo,index,PathSimplifier){
		return myPathSimplifierInfo.createPathNavigator(index, //关联第1条轨迹
		        {
			//loop: true, //循环播放
		    speed: 100,
		    pathNavigatorStyle: {
	        width: 16,
	        height: 32,
	        content: PathSimplifier.Render.Canvas.getImageContent('./img/car.png', function(){
	        	myPathSimplifierInfo.renderLater();
	        	
	        }, function(){
	        	console.log("图片加载失败!");
	        }),
	        strokeStyle: null,
	        fillStyle: null
		    }
     
		 });
	};

	//添加延长轨迹
	this.addPathNaviSimpl=function(data){
		console.log("延长轨迹.......");
		
		if(data!=null && data.path && jQuery.isArray(data.path)){
			var part=this;
			AMapUI.load(['ui/misc/PathSimplifier'], function(PathSimplifier) {
				 if (!PathSimplifier.supportCanvas) {
				    	console.log("当前环境不支持 Canvas!");
				        return;
				    }
				 
				 var myPathSimplifierInfo=part.getPathSimplifierIns(PathSimplifier);
				 var naviArr=myPathSimplifierInfo.getPathNavigators();
				 var pathData=null;
				 var cursor=null;
				 var status=null;
				 if(naviArr!=null && naviArr.length>0){
					  pathData=myPathSimplifierInfo.getPathData(0);
					  cursor = naviArr[0].getCursor().clone(); //保存巡航器的位置
			          status = naviArr[0].getNaviStatus();
			         
				 }else{
					 part.addOnPointClickListener(myPathSimplifierInfo);
				 }
				 if(pathData!=null){
					 for(var i=0;i<data.path.length;i++){
			        	 pathData.path.push(data.path[i]);
			        	 pathData.datas.push(data.datas[i]);
			         } 
				 }else{
					 pathData=data; 
				 }
		        myPathSimplifierInfo.setData([pathData]);
		       
		        var navi1 = part.getPathNavi(myPathSimplifierInfo,0,PathSimplifier);
		        if (status==null || status !== 'stop') {
		        	navi1.start();
		         }
				  //恢复巡航器的位置
		         if (cursor!=null && cursor.idx >= 0) {
		        	 navi1.moveToPoint(cursor.idx, cursor.tail);
		         }
			});
		}
	};
	
	this.searchPathSimplifier=function(){
		console.log("查询方法searchPathSimplifier");
		if(this.myPathSimplifierInfo){
			var lastData=null;
			var pathData=this.myPathSimplifierInfo.getPathData(0);
			console.log(pathData);
			var datas=pathData.datas;
			if(datas!=null && datas.length>0){
				lastData=datas[datas.length-1];
			}
			console.log(lastData);
			if(lastData!=null){
				var params2={"sessionId":lastData.sessionId,"beginTimes":lastData.time};
				loadDrawPath(params2);
			}
		}
	};
	
	
	//还原地图初始化
	this.clearGdMap=function(){
		this.mp.clearMap();
		this.mp.setZoomAndCenter(11, [this.lng,this.lat]);
		//this.initCity();
		$("#map_tip").html("");
	};
	//初始化城市(根据初始化坐标获取)
	this.initCity=function(){
		var part=this;
		if(this.city_input!=null && this.city_input!=""){
			this.getProvinceCity(this.lng,this.lat,function(cityName){
				$("#"+part.city_input).val(cityName);
			});
		}
	};
	
	this.mp_search=function(cityName,keyWord,fn){
		var part=this;
		var mSearch=this.getPlaceSerch();
		mSearch.search(cityName+'&'+keyWord,function(status, result){
			part.mp.clearMap();
			if (status === 'complete' && result.info === 'OK') {
				var pois=result.poiList.pois;
				part.createMarkerList(pois);
				part.showAddress(pois[0]);
				if (fn && typeof fn === "function"){
					fn(pois);
				}
			}else{
				layer.alert("没有查询到记录！",{icon:2,title:['提示','text-align:left'],skin:'layui-layer-molv'});
			}
		}); 
		
	};
	
	//周边搜索
	this.mp_placeSearch=function(type,poi,radius,fn){
		//console.log("周边搜索");
		var part=this;
		var mSearch=new AMap.PlaceSearch({
	 		pageSize:10,
            pageIndex:1,
            city:'' //城市编码
		});
		mSearch.setType(type);
		mSearch.searchNearBy('',[poi.location.lng, poi.location.lat],radius,function(status, result){
			if (status === 'complete' && result.info === 'OK') {
				//获得返回信息点记录
				var pois=result.poiList.pois;
				part.mp.clearMap();
				var circle=part.createCircle(poi.location.lng, poi.location.lat,radius);
				circle.setMap(part.mp);
    			part.createMarkerList(pois);
    			//中心位置点 和查询出来的第一条记录重合
    			if(!poi.id || poi.id!=pois[0].id){
    				part.showCenterMarker(poi);
    			}
				//显示第一条记录
				part.showAddress(pois[0]);
				if (fn && typeof fn === "function"){
					fn(pois);
				}
    		}else{
    			layer.alert("周边 "+radius+" 米范围内没有搜索到【"+type+"】!",{icon:2,title:['提示','text-align:left'],skin:'layui-layer-molv'});
    		}
			
		});
		
	};
	//描述地图范围
	this.createCircle=function(lng,lat,radius){
		var circle=new AMap.Circle({
			center:[lng,lat],
			radius: radius, //半径
	       // strokeColor: "#F33", //线颜色
	       // strokeOpacity: 1, //线透明度
	        strokeWeight: 1, //线粗细度
	        //fillColor: "#ee2200", //填充颜色
	        fillOpacity: 0.2//填充透明度
		});
		return circle;
	};
	//显示中心点marker位置
	this.showCenterMarker=function(poi){
		var part=this;
		var marker=part.createMarker(null,poi.name,poi.location.lng,poi.location.lat);
		marker.setMap(part.mp);
		AMap.event.addListener(marker, 'click', function(e){
			var infoWin=part.getInfoWindow();
			infoWin.setContent(part.createInfoWinUI(poi));
			infoWin.open(part.mp,marker.getPosition());
		});
	};
	this.createMarkerList=function(pois){
		var part=this;
		this.markerList={};
		$.each(pois, function(index,poi) {
			poi["index"]=index;
			var marker=part.createMarker(poi.index || 0,poi.name,poi.location.lng, poi.location.lat);
			part.markerList[poi.id]=marker;
			marker.setMap(part.mp);
			AMap.event.addListener(marker, 'click', function(e){
				var infoWin=part.getInfoWindow();
				infoWin.setContent(part.createInfoWinUI(poi));
				infoWin.open(part.mp,marker.getPosition());
			});
		});
	};
	//创建一个marker对象
	this.createMarker=function(index,poiname,lng,lat){
		var marker = new AMap.Marker({
			    position: [lng,lat],
			    title: poiname,
			    topWhenClick:true,
			    clickable:true
		});
		if(index != null && index>=0){
			marker.setIcon('./img/bd'+index+'.png');
		}
		return marker;
	};
	
	
	this.getProvinceCity=function(lng,lat,fn){
		this.getAddress(lng,lat,function(result){
			//console.log(result);
			var pcity="";
			if(result!=null){
				var cp=result.regeocode.addressComponent;
				if(cp.city!=null && cp.city!=""){
					pcity=cp.province+"-"+cp.city;
				}else{
					pcity=cp.province
				}
			}
			if (fn && typeof fn === "function"){
				fn(pcity);
			}
		});
	};
	
	this.getAddress=function(lng,lat,fn){
		var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });
        geocoder.getAddress([lng,lat],function(stauts,result){
        	if (fn && typeof fn === "function"){
	        	if(result && result.info=='OK'){
					fn(result);
	        	}else{
	        		fn(null);
	        	}
        	}
        });
	};
	
	/**
	 * 根据经纬度显示当前坐标位置
	 * callData  来电信息
	**/
	this.showCurrentLocation=function(callData){
		this.isVideoLoad=false;
		this.closeLoadVideoTime();
		var lng=callData.longitude || this.lng;
		var lat=callData.latitude || this.lat;
		var sessionId=callData.sessionId || null;//来电sessionId
		var sosType=callData.sosType || null;//救援类型
		var imei=callData.imei || null; //设备IMEI 用来获取设置的常用信息点数据
		var isUploadLocation=callData.uploadData;//后台是否有上传gps数据
		var part=this;
		
		this.getAddress(lng,lat,function(result){
			if(result!=null){
				var address=result.regeocode.formattedAddress;
				
				part.mp.clearMap();
				
				part.mp.setZoomAndCenter(part.mpZoom, [lng,lat]);
				
				var marker=part.createMarker(null,address,lng,lat);
				
				if(isUploadLocation){
					marker.setMap(part.mp);
				}
				part.mp.setCenter(marker.getPosition());
				
				var infoWin=part.getInfoWindow();
				
				var currentWinUI=part.createCurrentLocationUI(address,callData,isUploadLocation)
				
				infoWin.setContent(currentWinUI);
				infoWin.open(part.mp,marker.getPosition());
				
				AMap.event.addListener(marker, 'click', function(e){
					infoWin.open(part.mp,marker.getPosition());
				});
				
				if(part.city_input && part.city_input!=null && part.city_input!=""){
					var cp=result.regeocode.addressComponent;
					var city=cp.city!=''?cp.city:cp.province;
					part.setCityName(city,part.city_input);
				}
				//获取视频数据
				//如果sosType 属于救援
				if(window.parent.BaseData.isExistRescueServer(sosType)){
					part.startLoadVideo(sessionId);
				}else if(window.parent.BaseData.isExistNaviServer(sosType)){
					setTimeout(function(){
						part.findPoiCommonInfo(imei);
					},2000);
				}
			}
		});
	};
	
	this.startLoadVideo=function(sessionId){
		console.log("开始加载视频:"+sessionId);
		console.log(this.isVideoLoad);
		var part=this;
		if(!this.isVideoLoad){
			part.addLoadVideoUI();
			setTimeout(function(){
				part.findVideoList(sessionId);
			},3000);
			//每9秒重新加载一次视频数据
			this.videoLoadTimeId=setTimeout(function(){
				part.startLoadVideo(sessionId);
			},9000);
		}else{
			this.closeLoadVideoTime();
		}
	};
	
	this.closeLoadVideoTime=function(){
		if(this.videoLoadTimeId){
			try{
				clearTimeout(this.videoLoadTimeId);
			}catch (e) {
				
			}
		}
	};

	this.showAddress=function(poi){
		this.mp.setZoomAndCenter(this.mpZoom, [poi.location.lng, poi.location.lat]);
		var marker=this.markerList[poi.id] || this.createMarker(poi.index || 0,poi.name,poi.location.lng, poi.location.lat);
		marker.setTop(true);
		marker.setMap(this.mp);
		var infoWin=this.getInfoWindow();
		infoWin.setContent(this.createInfoWinUI(poi));
		infoWin.open(this.mp,marker.getPosition());
	};
	
	this.setCityName=function(city,inputId){
		$("#"+inputId).val(city);
	};

	/**
	 * 第一次数据加载 位置信息点
	 * address : 当前地址
	 * callData: 来电数据
	 * isUploadGps : 是否上传了经纬度
	 */
	this.createCurrentLocationUI=function(address,callData,isUploadGps){
		var sosType=callData.sosType || null;//救援类型
		var sosReqType=callData.sosReqType;//触发方式 0.主动触发，1.被动检测
		var collision=callData.collision || null;//碰撞数据
		var imei=callData.imei || null;//设备IMEI 来获取设置的常用信息点
		var reqTypeData=window.parent.BaseData.getSosReqType(sosReqType);
		var sosTypeName=window.parent.Dict.getEnumName(window.parent.Dict.enumClazzList.SosTypeEnum,sosType);
		var ui=[];
		ui.push('<div id="currentWinDiv" class="ibox" style="width: 430px;margin-bottom: 0">');
		ui.push('<div class="ibox-title" style="padding-left:10px;">');
		ui.push('<div>');
		if(sosTypeName!=null && sosTypeName!=""){
			ui.push('<h5 style="color:red;padding-left:4px;">'+sosTypeName+'</h5>');
		}
		if(reqTypeData && reqTypeData!=null){
			ui.push('<span class="pull-right" style="position: relative;right: 20px; color:'+reqTypeData.color+'">'+reqTypeData.name+'</span>');
		}
		ui.push('</div>');
		ui.push('<div style="clear: both;">');
		if(isUploadGps && isUploadGps==true){
			ui.push('<img src="img/position1.png" style="width:18px;vertical-align:bottom;"><span style="font-size: 12px;font-weight: 700;">'+address+'</span>');
		}else{
			ui.push('<img src="img/nolll.png" style="width: 18px;float: left;"><h5 style="margin: 2px 0 7px 7px;color:red;">未获取到客户位置信息...</h5>');
		}
		ui.push('</div>');
		ui.push('</div>');
		//判断是否为救援服务
		if(window.parent.BaseData.isExistRescueServer(sosType)){
			ui.push('<div class="ibox-content" style="padding: 4px 15px 1px 15px;">');
			ui.push('<div class="carousel slide m-b" id="carousel1" style="border-bottom: 1px solid #ddd;" >');
			ui.push(this.createInitLoadVideoUI());
			ui.push('</div>');
			ui.push(this.createCollisionUI(collision));
			ui.push('</div>');
		}else if(window.parent.BaseData.isExistNaviServer(sosType)){
			//如果是一键通导航服务的 就显示常用信息点数据，和周边搜索
			ui.push(this.createInitPoiComm(imei));
			//显示周边搜索框
			if(isUploadGps){
				var lng=callData.longitude || null;
				var lat=callData.latitude || null;
				var poi={"id":-1,"name":address,"location":{"lng":lng,"lat":lat}};
				ui.push("<div class='ibox-content' style='padding: 0 15px 1px 15px;'>");
				ui.push(this.createPlaceSearchDiv(poi));
				ui.push('</div>');
			}
		}
		//如果是救援预判的就显示按钮
		if(sosType && sosType==window.parent.BaseData.heraldFlag){
			ui.push(this.createBottomBtn());
		}
		ui.push('</div>');
		
		return ui.join('');
	};
	//初始化 常用信息点显示div
	this.createInitPoiComm=function(imei){
		var poiUI=[];
		poiUI.push('<div class="ibox-content" style="padding: 5px 15px 10px 15px; font-size:12px;">');
		//imei不为空
		if(imei && imei!=null){
			poiUI.push('<div id="poiCommon_home_div" class="form-group" style="margin-bottom: 10px;margin-top: 5px;">');
			poiUI.push('<i class="fa fa-home" style="margin-right: 3px;font-size: 15px;"></i>家：');
			poiUI.push('<span><i class="fa fa-spinner fa-spin"></i> 数据加载中...</span>');
			poiUI.push('</div>');
			poiUI.push('<div id="poiCommon_company_div" class="form-group" style="margin-bottom: 10px;margin-top: 5px;">');
			poiUI.push('<i class="fa fa-bank" style="margin-right: 3px;"></i>公司：');
			poiUI.push('<span><i class="fa fa-spinner fa-spin"></i> 数据加载中...</span>');
			poiUI.push('</div>');
			
		}else{
			poiUI.push('<div class="form-group" style="margin-bottom: 10px;margin-top: 5px;">');
			poiUI.push('<div>未获取到设备IMEI,无法加载常用信息点数据</div>');
			poiUI.push('</div>');
		}
		
		poiUI.push("</div>");
		return poiUI.join('');
	};
	
	
	
	this.showSuccessPoiComm=function(datas){
		var homeData=null,companyData=null;
		if(datas && datas.length>0){
			for(var i=0;i<datas.length;i++){
				var data=datas[i];
				//content_Type(0:公司 1:家 2:外出)
				if(data.content_Type==window.parent.BaseData.poiType.COMPANY.code){
					companyData=data;
				}else if(data.content_Type==window.parent.BaseData.poiType.HOME.code){
					homeData=data;
				}
			}
		}
		this.showPoiCommonDiv(homeData,companyData);
	};
	
	this.showPoiCommonDiv=function(homeData,companyData){
		$("#poiCommon_home_div").empty();
		$("#poiCommon_company_div").empty();
		$("#poiCommon_home_div").append("<i class='fa fa-home' style='margin-right: 3px;font-size: 15px;'></i>家：");
		$("#poiCommon_company_div").append("<i class='fa fa-bank' style='margin-right: 3px;font-size: 12px;'></i>公司：");
		if(homeData && homeData!=null){
			$("#poiCommon_home_div").append("<span>"+homeData.content+"</span>");
			$("#poiCommon_home_div").append("<span class='btn btn-outline btn-default btn-xs pull-right' style='width: 55px;position: relative;top: -2px;' onclick='sendInfoByPoiComm("+JSON.stringify(homeData)+")'>发送</span>");
		}else{
			$("#poiCommon_home_div").append("<span style='color:red'>未设置地址</span>");
		}
		
		if(companyData && companyData!=null){
			$("#poiCommon_company_div").append("<span>"+companyData.content+"</span>");
			$("#poiCommon_company_div").append("<span class='btn btn-outline btn-default btn-xs pull-right' style='width: 55px;position: relative;top: -2px;' onclick='sendInfoByPoiComm("+JSON.stringify(companyData)+")'>发送</span>");
		}else{
			$("#poiCommon_company_div").append("<span style='color:red'>未设置地址</span>");
		}
		
	}
	
	
	
	this.showFailPoiComm=function(){
		$("#poiCommon_home_div").empty();
		$("#poiCommon_company_div").empty();
		$("#poiCommon_home_div").append('<i class="fa fa-home" style="margin-right: 3px;font-size: 15px;"></i>家：');
		$("#poiCommon_home_div").append('<span style="color:red">获取地址失败</span>');
		$("#poiCommon_company_div").append('<i class="fa fa-bank" style="margin-right: 3px;font-size: 12px;"></i>公司：');
		$("#poiCommon_company_div").append('<span style="color:red">获取地址失败</span>');
	};
	
	
	
	/**
	 * 初始化 视频列表load 状态显示
	 */
	this.createInitLoadVideoUI=function(){
		var initUI=[];
		initUI.push('<div class="carousel-inner" style="border-bottom: 1px solid #ddd;padding-bottom: 15px">');
		initUI.push('<div class="item active">');
		initUI.push('<div class="ul-list">');
		initUI.push('<div style="padding:45px 0;">');
		initUI.push('<img src="img/loading-2.gif"><span>视频加载中</span>');
		initUI.push('</div>');

		initUI.push('</div>');
		initUI.push('</div>');
		initUI.push('</div>');
		return initUI.join('');
	}

	this.addLoadVideoUI=function(){
		var loadUI=this.createInitLoadVideoUI();
		$("#carousel1").empty();
		$("#carousel1").append(loadUI);
	}
	
	/**
	 * 添加视频加载成功的ui
	 */
	this.addSuccessVideoUI=function(datas){
		var videoUI=this.createVideoUI(datas);
		$("#carousel1").empty();
		$("#carousel1").append(videoUI);
		initVideo();
		//$(".vjs-default-skin .vjs-big-play-button").css("background", "url(profile_big.jpg) no-repeat;");
	}
	/**
	 * 添加视频加载失败的ui
	 */
	this.addFailVideoUI=function(){
		var videoUI=this.loadFailVideoUI();
		$("#carousel1").empty();
		$("#carousel1").append(videoUI);
	}
	
	/**
	 * 加载视频数据
	 */
	this.createVideoUI=function(datas){
		var uiArr=[];
		uiArr.push('<div class="carousel-inner">');
		if(datas!=null && datas.length>0){
			var cla="item active";
			var part=this;
			$.each(datas,function(index,data){
				if(index>0){
					cla="item";
				}
				uiArr.push('<div class="'+cla+'">');
				uiArr.push('<div class="ul-list" style="height: 170px;padding:0 15px;">');
				uiArr.push(part.showVideoInfo(data));
				uiArr.push('</div></div>');
		
			});
		}
		uiArr.push('</div>');
		if(datas.length>1){
			uiArr.push(this.createNextPrev());
		}
		return uiArr.join('');
		
	}
	
	this.showVideoInfo=function(data){
		return '<div style="height: 170px;"><video class="video-js vjs-default-skin" controls preload="none" width="100%" height="170px" data-setup="{}"><source src="'+data.url+'" type="video/mp4" /></video></div>';
	}
	
	
	
	this.createNextPrev=function(){
		var prev=[];
		prev.push('<span data-slide="prev" href="home.html#carousel1" class="left carousel-control">');
		prev.push('<span class="icon-prev"></span>');
		prev.push('</span>');
		prev.push('<span data-slide="next" href="home.html#carousel1" class="right carousel-control">');
		prev.push('<span class="icon-next"></span>');
		prev.push('</span>');
		return prev.join('');
		
	}
	/**
	 * 视频加载失败的ui
	 */
	this.loadFailVideoUI=function(){
		var failUI=[];
		failUI.push('<div class="carousel-inner" style="border-bottom: 1px solid #ddd;padding-bottom: 15px">');
		failUI.push('<div class="item active">');
		failUI.push('<div class="ul-list">');
		failUI.push('<div style="padding:45px 0;"><img src="img/icon_nav_noti.png" style="cursor:pointer;" onclick="refishVideoList()"><span>正在获取视频,点击重新加载</span></div>');
		failUI.push('</div>');
		failUI.push('</div>');
		failUI.push('</div>');
		return failUI.join('');
	}
	
	//创建碰撞数据ui 2017-01-12 
	this.createCollisionUI=function(collision){
		var html=[];		
		if(collision!=null && collision.collisionWord!=null && collision.collisionWord!="" && typeof(collision.collisionWord)!='undefined'){
			var cWordText=window.parent.Dict.getDictName(window.parent.Dict.dictTypeList.COLLISIONWORD,collision.collisionWord);
			if(collision.sceneName!=null && collision.sceneName!="" && typeof(collision.sceneName)!='undefined'){
				html.push("<span style='color:green; font-size:12px;' >"+collision.sceneName+"</span>");
			}
			
			html.push('<h4 class="text-danger">'+cWordText+'</h4>');
			
		}
		return html.join('');
	};
	
	this.createBottomBtn=function(){
		var btnUI=[];
		btnUI.push('<div style="border-top: 1px solid #ddd" id="rescue_btn_div">');
		btnUI.push('<span id="cancel_rescue_btn" class="btn btn-outline btn-link" style="padding: 12px 30px;" onclick="cancelRescue()">误报</span>');
		btnUI.push('<span id="confirm_rescue_btn" class="btn btn-outline btn-link pull-right text-danger" style="padding: 12px 30px;" onclick="confirmRescue()">呼叫车主</span>');
		btnUI.push('</div>');
		return btnUI.join('');
	}
	//根据设备IMEI获取常用信息点数据
	this.findPoiCommonInfo=function(imei){
		console.log("开始获取常用信息点数据：imei="+imei);
		if(imei!=null){
			var part=this;
			$.ajax({
				url:request_url+'/poiCommonRest/findPoiCommomList.do',
				type:'POST',
				async:false,
				data:{"imei":imei},
				timeout:30000,
				success:function(result){
					if(result.success){
						part.showSuccessPoiComm(result.data);
					}else{
						part.showFailPoiComm();
					}
				},
				error:function(){
					part.showFailPoiComm();
				}
				
			});
			
		}
		
	};
	
	
	
	/**
	 * 来电加载视频数据
	 */
	this.findVideoList=function(sessionId){
		console.log("开始加载视频数据: sessionId="+sessionId);
		//测试参数
		//sessionId=1;
		var part=this;
		$.ajax({
			url:request_url+'/callinfo/findVideoList.do',
			type:'POST',
			async:false,
			data:{"sessionId":sessionId},
			timeout:30000,
			success:function(result){
				console.log("获取视频数据返回结果....");
				console.log(result);
				if(result.success && result.data!=null && result.data.length>0){
					//视频加载成功的UI
					part.addSuccessVideoUI(result.data);
					part.isVideoLoad=true;
				}else{
					//视频加载失败的ui
					part.addFailVideoUI();
				}
			},
			error:function(){
				part.addFailVideoUI();
			}
			
		});
	
		
		
		
	}
	
	
	
	
	
	

	/**
	 * 该方法在地图上显示信息点位置
	 */
	this.createInfoWinUI=function(poi){
		var html=[];
		html.push("<div class='ibox' style='width: 375px;margin-bottom: 0'>");
		
		html.push("<div class='ibox-title'>");
		html.push("<h5 style='width:100%'>");
		html.push(poi.name || "");
		html.push("</h5>");
		html.push("<p style='margin:0;font-size:11px'>"+(poi.address || '')+"</p>");
		html.push("</div>");
		
		html.push("<div class='ibox-content' style='padding: 4px 15px 1px 15px;'>");
		
		/*html.push("<div class='form-group'>");
		html.push("<label class='control-label'>下发方式选择：</label>");
		html.push("<div class='pull-right'>");
		html.push("<label class='checkbox-inline i-checks' style='margin: 0 8px 0 0'>");
		html.push("<input type='radio' name='radio' checked='checked' value=0>系统推荐</label>");
		html.push("<label class='checkbox-inline i-checks' style='margin: 0 8px 0 0'>");
		html.push("<input type='radio' name='radio' value=1>高速优先</label>");
		html.push("<label class='checkbox-inline i-checks' style='margin: 0'>");
		html.push("<input type='radio' name='radio' value=2>一般通道</label>");
		html.push("</div>");
		html.push("</div>");*/
		
		html.push(this.createInfoLi(poi));
		
		html.push(this.createPlaceSearchDiv(poi));
		
		html.push(this.createPoiCommonDiv(poi));
		
		html.push("</div>");
		html.push("</div>")
		
		return html.join("");
	};
	
	
	this.createInfoLi=function(poi){
		var li=[];
		li.push("<div class='form-group' style='height:40px'>");
		li.push("<span  class='btn btn-danger btn-sm pull-right' style='width:22%' onclick='sendInfo("+JSON.stringify(poi)+")'>发 送</span>");
		/*li.push("<label class='control-label' style='width:275px;'>"+poi.name+"</label>");
		li.push("<p>"+poi.address+"</p>");*/
		li.push("</div>");
		return li.join("");
			
	};
	
	this.createPoiCommonDiv=function(poi){
		var pc=[];
		pc.push("<div class='form-group'>");
		pc.push("<label class='control-label'>常用目的地设置：</label>");		
		pc.push("<div class='pull-right'>");
		pc.push("<span class='btn btn-outline btn-default btn-xs' style='margin-right: 10px;' onclick='savePoiCommonInfo("+window.parent.BaseData.poiType.COMPANY.code+","+JSON.stringify(poi)+")'><i class='fa fa-bank' style='margin-right: 15px;'></i>公司</span>");
		pc.push("<span class='btn btn-outline btn-default btn-xs' style='margin-right: 10px;' onclick='savePoiCommonInfo("+window.parent.BaseData.poiType.HOME.code+","+JSON.stringify(poi)+")'><i class='fa fa-home' style='margin-right: 27px;font-size: 15px;'></i>家</span>");
		//pc.push("<span class='btn btn-outline btn-default btn-xs' onclick='savePoiCommonInfo(\"2\","+JSON.stringify(poi)+")'><i class='fa fa-road' style='margin-right: 15px;'></i>外出</span>");
		pc.push("</div>");	
		pc.push("</div>");
		return pc.join("");
	};
	
	this.createPlaceSearchDiv=function(poi){
		console.log("创建周边搜索div.....");
		//console.log(poi);
		var ps=[];
		ps.push("<div class='form-group' style='margin-bottom: 15px;margin-top: 20px;'>");
		ps.push('<input type="text" id="search_place_input" class="form-control" style="height: 25px;position: relative;top: -4px;width: 155px;padding: 0 12px;display: inline;" placeholder="周边搜索">');
		ps.push("<div class='pull-right'>");
		ps.push("<span class='text-info' style='margin-right: 10px;cursor:pointer;' onclick='searchPlace(this,"+JSON.stringify(poi)+")'>宾馆</span>");
		ps.push("<span class='text-info' style='margin-right: 10px;cursor:pointer;' onclick='searchPlace(this,"+JSON.stringify(poi)+")'>餐厅</span>");
		ps.push("<span class='text-info' style='margin-right: 10px;cursor:pointer;' onclick='searchPlace(this,"+JSON.stringify(poi)+")'>加油站</span>");
		ps.push("<span class='btn btn-outline btn-default btn-xs' style='width: 55px;position: relative;top: -2px;' onclick='searchPlaceInfo("+JSON.stringify(poi)+")'>搜索</span>");
		ps.push("</div>");
		ps.push("</div>");
		return ps.join("");
	};
	

};













