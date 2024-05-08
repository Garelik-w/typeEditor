import request from '@/utils/request'

// 获取文章列表
export function getList(params) {
  return request({
    url: '/article/',
    method: 'get',
    params
  })
}

// 根据id获取文章
export function get(id) {
  return request({
    url: '/article/' + id + '/',
    method: 'get'
  })
}

// 新建文章
export function postArticle(data) {
  return request({
    url: '/article/',
    method: 'post',
    data: data
  })
}

// 修改文章
export function putArticle(data) {
  return request({
    url: '/article/' + data.articleid + '/',
    method: 'put',
    data: data
  })
}

// 根据id删除文章
export function del(id) {
  return request({
    url: '/article/' + id + '/',
    method: 'delete'
  })
}
