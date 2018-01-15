package com.ojbk.base;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSONObject;

public abstract class BaseRest
{
	
	/*//处理JSON数据
	protected <D> String getJsonString(BaseInfo<D> info)
	{
		JConfigParames params = new JConfigParames(Constant.JSON_DATE_PATTERN);
		params.setExcludeNull(true);
		JsonConfig config = JsonFacade.createJSONConfig(params);
		JSONObject sortBaseInfo = getSortBaseInfo(info, config);
		return JsonFacade.getJsonString(sortBaseInfo, config);
	}
	
	private <D> JSONObject getSortBaseInfo(BaseInfo<D> info, JsonConfig config)
	{
		JSONObject data = new JSONObject();
		data.element("protocolVersion", info.getProtocolVersion());
		data.element("requestId", info.getRequestId());
		data.element("data", info.getData(), config);
		data.element("errorCode", info.getErrorCode());
		data.element("error", info.getError());
		data.element("success", info.getSuccess());
		return data;
	}*/
	
	public void print(HttpServletResponse response, Object content)
	{
		try
		{
			PrintWriter out = response.getWriter();
			out.print(content);
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
	}
}
