import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/api-token-auth/',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/get-user-info/',
    method: 'post'
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

// 根据id获取用户
export function getUser(id) {
  return request({
    url: '/user/' + id + '/',
    method: 'get'
  })
}

// 新增用户
export function postUser(data) {
  return request({
    url: '/user/',
    method: 'post',
    data: data
  })
}

// 修改用户
export function putUser(data) {
  return request({
    url: '/user/' + data.userid + '/',
    method: 'put',
    data: data
  })
}

// 根据id删除用户
export function delUser(id) {
  return request({
    url: '/user/' + id + '/',
    method: 'delete'
  })
}

// 检查用户名是否重复
export function checkUser(username) {
  return request({
    url: '/check-user/?username=' + username,
    method: 'get'
  })
}

