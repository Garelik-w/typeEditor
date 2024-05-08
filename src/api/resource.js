import request from '@/utils/request'

// 上传资源
export function upload(data) {
  return request({
    url: '/resource/',
    method: 'post',
    data: data
  })
}

// 获取用户资源
export function getUserResourceList(params) {
  return request({
    url: '/resourceuser/',
    method: 'get',
    params
  })
}

// 新建用户资源
export function postUserResource(data) {
  return request({
    url: '/resourceuser/',
    method: 'post',
    data: data
  })
}

// 删除用户资源
export function delUserResource(id) {
  return request({
    url: '/resourceuser/' + id + '/',
    method: 'delete'
  })
}
