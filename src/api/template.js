import request from '@/utils/request'

// 获取模板列表
export function getList(params) {
  return request({
    url: '/template/',
    method: 'get',
    params
  })
}

// 根据id获取模板
export function get(id) {
  return request({
    url: '/template/' + id + '/',
    method: 'get'
  })
}

// 新增模板
export function post(data) {
  return request({
    url: '/template/',
    method: 'post',
    data: data
  })
}

// 修改模板
export function put(data) {
  return request({
    url: '/template/' + data.templateid + '/',
    method: 'put',
    data: data
  })
}

// 删除模板
export function del(id) {
  return request({
    url: '/template/' + id + '/',
    method: 'delete'
  })
}

// 获取用户收藏列表
export function getUserTemplateList(params) {
  return request({
    url: '/templateuser/',
    method: 'get',
    params
  })
}

// 新增用户模板收藏
export function postUserTemplate(data) {
  return request({
    url: '/templateuser/',
    method: 'post',
    data: data
  })
}

// 删除用户模板收藏
export function delUserTemplate(id) {
  return request({
    url: '/templateuser/' + id + '/',
    method: 'delete'
  })
}
