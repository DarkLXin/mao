var HistoryRescue=function(config){
	config=config || {};
	this.renderId=config.renderId || "history_rescue_div";
	
	this.show=function(mobile,cid){
		if(mobile || cid){
			var part=this;
			this.findRescue(mobile,cid,function(datas){
				part.loadItems(datas);
			});
		}
	};
	
	this.loadItems=function(datas){
		$("#"+this.renderId).empty();
		if(datas && datas.length>0){
			var part=this;
			$.each(datas,function(index,data){
				$("#"+part.renderId).append(part.createItemDiv(data));
			});
		}
	};
	
	this.createItemDiv=function(data){
		var item=[];
		if(data){
			item.push("<div class='feed-element' onclick='jumpToDetail("+data.id+")'>");
			item.push("<div class='media-body'>");
			item.push("<small class='pull-right'>"+this.covertDate(data.createDate)+"</small>");
			item.push("<strong>救援："+data.id+"</strong><br>");
			item.push("<small class='text-muted'>"+Dict.getEnumName(Dict.enumClazzList.AccidentLeveEnum,data.accedentLevel)+"</small>");
			item.push(" <small class='pull-right'>"+Dict.getEnumName(Dict.enumClazzList.RescueStatusEnum,data.rescueStatus)+"</small>");
			item.push("</div>");
			item.push("</div>");
		}
		return item.join("");
	};
	
	this.findRescue=function(mobile,cid,fn){
		if(mobile || cid){
			$.ajax({
				url:request_url+'/ymRescue/findRescueBillByMobile.do',
				method:'POST',
				dataType: 'json',
		  		data: {mobile:mobile,cid:cid},
		  		success: function(result){
		  			if (fn && typeof fn === "function"){
						fn(result);
					}
		  		}
			});
		}
	};
	this.covertDate=function(date){
		//2017-05-01 05:05:05
		if(date!=null){
			date=$.trim(date);
			return date.substring(0,date.length-3);
		}
		return "";
	}
	
}