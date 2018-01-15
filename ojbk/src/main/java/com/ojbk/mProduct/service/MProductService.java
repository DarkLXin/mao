package com.ojbk.mProduct.service;

import java.util.List;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ojbk.mProduct.bean.MProduct;
import com.ojbk.mProduct.dao.MProductDao;
@Service
public class MProductService {
@Autowired
private MProductDao dao;
	@Transactional (readOnly=false)
	public void save(MProduct bean) {
		if (bean.getId()==null) {
			bean.setCreateDate(new Date());
			dao.insert(bean);	
		}else {
			dao.update(bean);
		}
	}
	public List<MProduct> findList(MProduct bean) {
		return dao.findList(bean);
	}
	public MProduct get(Integer id) {
		return dao.get(id);
	}
	@Transactional (readOnly=false)
	public void deleteById(Integer id) {
		MProduct entity =new MProduct();
		entity.setId(id);
		dao.delete(entity);
	}

}
