package com.ojbk.base;

import java.util.List;

import com.ecar.commons.cf.common.utils.StringUtil;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

/** 
* @ClassName: SimpleBaseController
* @Description: TODO(这里用一句话描述这个类的作用)
* @author zlf
* @date 2016-11-4 上午10:17:44
* 
*/
public abstract class SimpleBaseController
{
    /** 
     * @Title: startPage
     * @Description: 
     * TODO(这里用一句话描述这个方法的作�?
     * @param page
     * @param rows
     * @author zlf
     * @date 2016-11-4 上午10:18:31
     * @version V1.0
     */
    protected void startPage(int page, int rows)
    {
        startPage(page, rows, null);

    }
  /**
   * 
  * @Title: startPage
  * @Description: 
  * order 分页 ,如："age.asc,gender.desc"
  * @param page
  * @param rows
  * @param order
  * @author zlf
  * @date 2016-11-4 下午05:24:32
  * @version V1.0
   */
    protected void startPage(int page, int rows, String order)
    {
        if (StringUtil.isNil(order))
        {
            PageHelper.startPage(page, rows);
        } else
        {
            PageHelper.startPage(page, rows, order);
        }

    }

    /** 
     * @Title: toResponse
     * @Description: 
     * TODO(这里用一句话描述这个方法的作�?
     * @param list
     * @return
     * @author zlf
     * @date 2016-11-4 上午10:19:48
     * @version V1.0
     */
    @SuppressWarnings("unchecked")
    protected Response succeedResponse(List<?> list)
    {
        Response response = new Response();
        PageInfo pageInfo = new PageInfo(list);
        response.setPage(pageInfo.getPageNum());   //从第几行�?��显示
        response.setRows(pageInfo.getList());          //总共几行记录
        response.setRecords(pageInfo.getTotal());   //显示到第几行
        response.setTotal(pageInfo.getPages());     //总共几页
        return response;
    }
    
    @SuppressWarnings("unchecked")
    protected Response succeedResponse(List<?> list,int rows,long total)
    {
        Response response = new Response(); 
        PageInfo pageInfo = new PageInfo(list);
        long pageNum = (long) ((total%rows>0)?(total/rows+1):total/rows); 
        response.setRows(pageInfo.getList());          //总共显示几行记录
        response.setRecords(total);   //总行�?
        response.setTotal(pageNum);     //总共几页
        return response;
    }

    /** 
     * @Title: faildResponse
     * @Description: 
     * TODO(这里用一句话描述这个方法的作�?
     * @param errorCode
     * @param errorMessage
     * @author zlf
     * @date 2016-11-4 上午10:24:39
     * @version V1.0
     */
    @SuppressWarnings("unchecked")
    protected Response faildResponse(String errorCode, String errorMessage)
    {
        Response response = new Response();
        response.setCode(errorCode);
        response.setMessage(errorMessage);
        return response;
    }

    /** 
    * @Title: faildSystemErrorResponse
    * @Description: 
    * TODO(这里用一句话描述这个方法的作�?
    * @author zlf
    * @date 2016-11-4 上午10:26:55
    * @version V1.0
    */
    protected Response faildSystemErrorResponse()
    {
        return faildResponse("1000", "�?系统出BUG了，工程师正在抢救中...");

    }

}
