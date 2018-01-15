package com.ojbk.base;

import java.util.List;

/**
 * DAOæ”¯æŒç±»å®ç? */
public interface TreeDao<T extends TreeEntity<T>> extends CrudDao<T> {

	/**
	 * æ‰¾åˆ°æ‰?œ‰å­èŠ‚ç‚?	 * @param entity
	 * @return
	 */
	public List<T> findByParentIdsLike(T entity);

	/**
	 * æ›´æ–°æ‰?œ‰çˆ¶èŠ‚ç‚¹å­—æ®?	 * @param entity
	 * @return
	 */
	public int updateParentIds(T entity);
	
}