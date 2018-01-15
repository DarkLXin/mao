
package com.ojbk.base;

import java.io.Serializable;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.log4j.Logger;

/**
 * <p>Class Name    : BaseInfo</p>
 * <p>Description	: 基本对象</p>
 * @author 		    : yanshuanggui
 * <p>Date          : Jan 19, 2013 2:14:16 PM</p>
 * @version         : V1.0
 */
public final class BaseInfo<T>  implements Serializable, Cloneable
{
	private static final long serialVersionUID = -8419326403652977068L;
	
	private static Logger logger = Logger.getLogger(BaseInfo.class);
	
	private String protocolVersion;	//应用协议的版�?
	private String requestId;		//消息计数器时间戳
	private T data;            		//请求的数�?
	private String errorCode;   	//消息�?
	private String error;     		//消息
	private String success;         //是否成功

	public BaseInfo()
	{

	}
	
	public BaseInfo(T data)
	{
		this.data = data;
	}
	
	public T getData()
	{
		return data;
	}
	public void setData(T data)
	{
		this.data = data;
	}

	public String getError()
	{
		return error;
	}
	public void setError(String error)
	{
		this.error = error;
	}

	public String getErrorCode()
	{
		return errorCode;
	}
	public void setErrorCode(String errorCode)
	{
		this.errorCode = errorCode;
	}

	public String getProtocolVersion()
	{
		return protocolVersion;
	}
	public void setProtocolVersion(String protocolVersion)
	{
		this.protocolVersion = protocolVersion;
	}
	
	public String getRequestId()
	{
		return requestId;
	}
	public void setRequestId(String requestId)
	{
		this.requestId = requestId;
	}
	
	public String getSuccess()
	{
		return success;
	}
	public void setSuccess(String success)
	{
		this.success = success;
	}
	
	@SuppressWarnings("unchecked")
	public BaseInfo clone()
	{
		BaseInfo baseInfo = null;	
		try
		{
			
			baseInfo = (BaseInfo)super.clone();
			T t = (T) BeanUtils.cloneBean(data); 
			baseInfo.setData(t);
		}
		catch (Exception e)
		{
			logger.error("BaseInfo clone fail, " + e.getMessage() + ".");
			e.printStackTrace();
		}
		return baseInfo;	
	}
	
	public String toString()
	{
		StringBuffer sb = new StringBuffer();
		sb.append("BaseInfo >> : ");
		sb.append("[\n");
		if(protocolVersion != null && !"".equals(protocolVersion))
		{			
			sb.append("protocolVersion : " + protocolVersion + ",\n");
		}
		if(requestId != null && !"".equals(requestId))
		{			
			sb.append("requestId : " + requestId + ",\n");
		}
		if(data != null && !"".equals(data))
		{			
			sb.append("data : " + data.toString() + ",\n");
		}		
		if(errorCode != null && !"".equals(errorCode))
		{			
			sb.append("errorCode : " + errorCode + ",\n");
		}
		if(error != null && !"".equals(error))
		{			
			sb.append("error : " + error + ",\n");
		}
		if(success != null && !"".equals(success))
		{			
			sb.append("success : " + success + ",\n");
		}
		sb.append("]");
		return sb.toString();
	}	
}