package com.ojbk.base;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service基类
 */
@Transactional(readOnly = true)
public abstract class CrudService<D extends CrudDao<T>, T extends DataEntity<T>>  {
	
	/**
	 * 持久层对�?	 */
	@Autowired
	protected D dao;
	
	/**
	 * 获取单条数据
	 * @param id
	 * @return
	 */
	public T get(Integer id) {
		return dao.get(id);
	}
	
	/**
	 * 获取单条数据
	 * @param entity
	 * @return
	 */
	public T get(T entity) {
		return dao.get(entity);
	}
	
	/**
	 * 查询列表数据
	 * @param entity
	 * @return
	 */
	public List<T> findList(T entity) {		
		return dao.findList(entity);
	}
	
	/**
	 * 查询前几条数�?	 * @return
	 */
	public List<T> findLimit(T entity){
		return dao.findLimit(entity);
	}

	/**
	 * 保存数据（插入或更新�?	 * @param entity
	 */
	@Transactional(readOnly = false)
	public void save(T entity) {
		if (entity.getIsNewRecord()){
			insert(entity);
		}else{
			update(entity);
		}
	}
	
	@Transactional(readOnly = false)
	public void insert(T entity){
		entity.preInsert();
		dao.insert(entity);
	}
	
	@Transactional(readOnly = false)
	public void update(T entity){
		entity.preUpdate();
		dao.update(entity);
	}
	
	/**
	 * 删除数据
	 * @param entity
	 */
	@Transactional(readOnly = false)
	public void delete(T entity) {
		dao.delete(entity);
	}
	
	/**
	 * 按id列表批量删除
	 * @param ids
	 * @return
	 */
	@Transactional(readOnly = false)
	public int deleteByIDs(Integer[] ids) {
		return dao.deleteByIDs(ids);
	}

}
