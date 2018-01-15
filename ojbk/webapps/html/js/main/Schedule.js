/**
 * 救援进度
 */

var Schedule=function(config){
	config = config || {};
	this.renderId=config.renderId || "schedule_div";
	
	this.scheduleIds={
			prossItems:"pross_items",
			prossRefresh:"pross_refresh"
			
	}
	//自定义提醒  code 表示命令type，isSend表示是否要发送到车机
	this.serviceItems={
			sitem1:{code:'Rescue110',name:'110提醒',text:'110报警',isSend:true},
			sitem2:{code:'Rescue120',name:'120提醒',text:'拨打120',isSend:true},
			sitem3:{code:'Rescue120_1',name:'120出发',text:'救护车已出发',isSend:true}
	}
	
	this.getServiceItem=function(code){
		var item=null;
		$.each(this.serviceItems,function(index,data){
			if(data.code==code){
				item=data;
				return false;
			}
		});
		return item;
	};

	
	
	this.init=function(){
		var html=[];
		/*html.push(this.createProssLink());
		html.push('<div class="ibox-content" style="padding: 0;height: calc(100% - 42px);overflow-y: auto;">');
		html.push('<div id="vertical-timeline" class="vertical-container light-timeline">');
		
		html.push('</div>')
		html.push('</div>');*/
		return html.join('');
	}
	
	this.createProssLink=function(){
		var prossHtml=[];
		/*prossHtml.push('<div class="ibox-title" style="padding: 12px 15px 7px;min-height: 42px;">');
        prossHtml.push('<a href="javascript:jumpTo();" style="color: inherit"><h5>发起救援</h5></a>');
        prossHtml.push('<div class="ibox-tools">');
        prossHtml.push('<a class="dropdown-toggle" data-toggle="dropdown" href="#">');
        prossHtml.push('<i class="fa fa-wrench"></i>');
        prossHtml.push('</a>');
        prossHtml.push('<ul class="dropdown-menu dropdown-user" id="'+this.scheduleIds.prossItems+'">');
        prossHtml.push(this.createProssItem());

        prossHtml.push('</ul>');
        prossHtml.push('<a href="#"><i class="fa fa-refresh" id="'+this.scheduleIds.prossRefresh+'"></i></a>');
        prossHtml.push('</div>');
        prossHtml.push('</div>');*/
		
		return prossHtml.join('');
		
	}
	this.createProssItem=function(){
		var items=[];
		$.each(this.serviceItems,function(index,item){
			items.push("<li alt="+item.code+"><a href='#'>"+item.name+"</a></li>");
		});
		return items.join("");
	}
	
	
	//刷新 重新加载数据
	this.onRefurbish=function(){
		console.log("点击刷新......");
		var callInfo=PageUtil.callInfo.call_Data;
		if(callInfo){
			this.show(callInfo.mobile,callInfo.sessionId);
		}
		
	};
	
	//保存救援进度
	this.addScheduleByCode=function(code){
		var callInfo=PageUtil.callInfo.call_Data;
		var callingStatus=PageUtil.callInfo.callingStatus;//通话状态
		if(callInfo && callInfo!=null && (callingStatus!=null && callingStatus!=BaseData.callingStatusList.endCall.code)){
			if(code){
				var serviceItem=this.getServiceItem(code);
				console.log(serviceItem);
				if(serviceItem.isSend){
					//PageUtil.ivs.onSendPromptInfo(callInfo.mobile,PageUtil.callInfo.IOSessionId,code);
				}
				
				this.saveSchedule(callInfo.mobile, callInfo.sessionId, serviceItem.text)
				
				
			}
		}else{
			layer.alert("只能在客户来电的时候下发进度！",{icon:2,title:['提示','text-align:left'],skin:'layui-layer-molv'});
		}
		
	}
	
	this.saveSchedule=function(mobile,sessionId,content){
		console.log("保存救援进度数据.....");
		if(mobile && sessionId){
			var part=this;
			$.ajax({
				url:'../schedule/save.do',
				method:'POST',
				dataType: 'json',
		  		data: {phone : mobile,sessionId:sessionId,content:content},
		  		success: function(result){
		  			console.log(result);
		  			if(result.code=='0'){
		  				part.show(mobile,sessionId);
		  			}else{
		  				layer_alert(result.message);
		  			}
		  			
		  		}
			});
		}
	}
	this.show=function(phone,sessionId){
		
		this.findScheduleInfo(phone, sessionId, this.showSchedule.bind(this));
	};
	
	this.findScheduleInfo=function(phone,sessionId,fn){
		if(phone && sessionId){
			$.ajax({
				url:'../schedule/findByPhone.do',
				method:'POST',
				dataType: 'json',
		  		data: {phone : phone,sessionId:sessionId},
		  		success: function(result){
		  			
		  			console.log(result);
		  			if(result!=null && result.length>0){
		  				if (fn && typeof fn === "function"){
		  					fn(result);
		  				}
		  			}
//		  			if(result.code=='0'){
//		  				part.show(mobile,sessionId);
//		  			}else{
//		  				layer_alert(result.message);
//		  			}
		  			
		  		}
				
			});
			
		}
//		var datas=[{phone:'188....',sessionId:'1111111111',content:'已开启绿色通道',createDate:'2017-03-03 17:32:23'},{phone:'188....',sessionId:'1111111111',content:'南山人民医院已发车',createDate:'2017-03-03 17:32:23'}];
//		
//		if (fn && typeof fn === "function"){
//			fn(datas);
//		}
	};
	
	this.showSchedule=function(datas){
		if(datas){
			$("#vertical-timeline").empty();
			$("#vertical-timeline").append(this.createScheduleItemList(datas));
		}
	}
	
	this.createScheduleItemList=function(datas){
		var itemArr = new Array(); 
		if(datas){
			var part=this;
			$.each(datas,function(index,data){
				itemArr.push(part.createScheduleItem(data,index==0?true:false));
			});
		}
		return itemArr.join("");
	}
	/**
	 * data={phone:'188....',sessionId:'1111111111',content:'已开启绿色通道',createDate:'2017-03-03 17:32:23'}
	 */
	this.createScheduleItem=function(data,isboo){
		var item=[];
		var cla="vertical-timeline-block ";
		if(isboo){
			cla+="curr";
		}
		item.push("<div class='"+cla+"'>");
		item.push("<div class='vertical-timeline-icon'></div>");
		item.push("<div class='vertical-timeline-content'>");
		item.push("<p>"+data.content+"</p>");
		item.push("<span class='vertical-date'>"+data.createDate+"</span>");
		item.push("</div>");
		item.push("</div>");
		return item.join("");
	};
	
	this.initEvent=function(){
		var part=this;
		
		$("#"+this.scheduleIds.prossRefresh).click(function(){
			part.onRefurbish();
		});
		
		$("#"+this.scheduleIds.prossItems+" li").click(function(){
			var code=$(this).attr("alt");
			part.addScheduleByCode(code);
		});
		
		
	};
	
	this.render=function(){
		$("#"+this.renderId).append(this.init());
		this.initEvent();
	};
}
