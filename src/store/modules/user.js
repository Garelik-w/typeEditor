import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    userid: '',
    avatar: '',
    usertype: null
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USER_ID: (state, userid) => {
    state.userid = userid
  },
  SET_USER_TYPE: (state, usertype) => {
    state.usertype = usertype
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const token = 'JWT ' + response.token
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
    // return new Promise((resolve, reject) => {
    //   commit('SET_TOKEN', 'token')
    //   setToken('token')
    //   resolve()
    // })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        if (!response) {
          reject('Verification failed, please Login again.')
        }
        commit('SET_NAME', response.username)
        commit('SET_USER_ID', response.userid)
        commit('SET_USER_TYPE', response.usertype)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
    // return new Promise((resolve, reject) => {
    //   commit('SET_NAME', 'test')
    //   commit('SET_USER_ID', '')
    //   commit('SET_USER_TYPE', null)
    //   commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
    //   resolve({})
    // })
  },

  // user logout
  logout({ commit, state }) {
    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     removeToken() // must remove  token  first
    //     resetRouter()
    //     commit('RESET_STATE')
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

