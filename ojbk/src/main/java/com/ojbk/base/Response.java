package com.ojbk.base;

import java.util.Map;

import java.util.List;

/**
 * @ClassName: DataResponse
 * @Description: TODO(这里用一句话描述这个类的作用)
 * @author zlf
 * @date 2016-11-3 下午03:39:09
 * 
 */
public class Response
{
    // �?��显示的数据集
    @SuppressWarnings("unchecked")
    private List rows;

    //当前�?
    private long page;

    //总页�?
    private long total;

    //总记录数
    private long records;

    // 自定义数�?
    private Map<String, Object> userdata;

    private String code = "0";

    private String message;

    public List getRows()
    {
        return rows;
    }

    public void setRows(List rows)
    {
        this.rows = rows;
    }

    public long getPage()
    {
        return page;
    }

    public void setPage(long page)
    {
        this.page = page;
    }

    public long getTotal()
    {
        return total;
    }

    public void setTotal(long total)
    {
        this.total = total;
    }

    public long getRecords()
    {
        return records;
    }

    public void setRecords(long records)
    {
        this.records = records;
    }

    public Map<String, Object> getUserdata()
    {
        return userdata;
    }

    public void setUserdata(Map<String, Object> userdata)
    {
        this.userdata = userdata;
    }

    public String getCode()
    {
        return code;
    }

    public void setCode(String code)
    {
        this.code = code;
    }

    public String getMessage()
    {
        return message;
    }

    public void setMessage(String message)
    {
        this.message = message;
    }

}
