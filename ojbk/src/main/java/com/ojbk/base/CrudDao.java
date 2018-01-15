package com.ojbk.base;

import java.util.List;

/**
 * DAO支持类实�? */
public interface CrudDao<T> extends BaseDao {

	/**
	 * 获取单条数据
	 * @param id
	 * @return
	 */
	public T get(Integer id);
	
	/**
	 * 获取单条数据
	 * @param entity
	 * @return
	 */
	public T get(T entity);
	
	/**
	 * 查询数据列表;
	 * @param entity
	 * @return
	 */
	public List<T> findList(T entity);
	
	/**
	 * limit �?条数�?	 * @param entity
	 * @return
	 */
	public List<T> findLimit(T entity);
	
	/**
	 * 查询�?��数据列表
	 * @param entity
	 * @return
	 */
	public List<T> findAllList(T entity);
	
	/**
	 * 查询当前�?	 * @return
	 */
	public int findMonth(T entity);
	
	/**
	 * 查询当周
	 * @return
	 */
	public int findWeek(T entity);
	
	/**
	 * 查询当日
	 * @return
	 */
	public int findDay(T entity);
	
	/**
	 * 查询�?��
	 * @return
	 */
	public long findAllCunt(T entity);

	
	/**
	 * 插入数据
	 * @param entity
	 * @return
	 */
	public int insert(T entity);
	
	/**
	 * 更新数据
	 * @param entity
	 * @return
	 */
	public int update(T entity);
	

	/**
	 * 删除数据（一般为逻辑删除，更新del_flag字段�?�?	 * @param entity
	 * @return
	 */
	public int delete(T entity);
	
	public void deleteById(Integer id);
	
	public int deleteByIDs(Integer[] ids);
	
}