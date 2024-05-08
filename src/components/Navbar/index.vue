<template>
  <div class="navbar">
    <!--    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />-->
    <div class="title">{{ title }}</div>
    <div v-if="this.showFunctionBar" style="width: 90%;margin: 5px auto;text-align: center;padding-left: 400px;position: absolute;">
      <el-tooltip class="item" effect="dark" content="新建图文" placement="bottom">
        <el-button icon="el-icon-document-add" size="medium" circle @click="handleNew" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="打开图文" placement="bottom">
        <el-button icon="el-icon-folder-opened" size="medium" circle @click="handleOpen" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="保存" placement="bottom">
        <el-button icon="el-icon-finished" size="medium" circle @click="handleSave" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="预览" placement="bottom">
        <el-button icon="el-icon-data-line" size="medium" circle @click="handlePreview" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="复制到公众号" placement="bottom">
        <el-button icon="el-icon-mobile-phone" size="medium" circle @click="handleToWX" />
      </el-tooltip>
    </div>

    <div class="right-menu">
      <el-dropdown v-if="userid" class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item>
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button v-if="!userid" type="text" style="margin-right: 20px;" @click.native="openLogin">登录</el-button>
    </div>
    <articlelist ref="articlelist" @doOpen="doOpen" />
    <preview ref="preview" />
    <copytowx ref="copytowx" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import articlelist from '@/components/Navbar/articlelist'
import preview from '@/components/Navbar/preview'
import copytowx from '@/components/Navbar/copytowx'
import avatar from '@/assets/imgs/avatar.gif'

export default {
  components: {
    articlelist,
    copytowx,
    preview
  }, props: {
    showFunctionBar: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userid'
    ]),
    title() {
      if (this.showFunctionBar) {
        return '图文排版'
      } else {
        return '模板管理'
      }
    }
  }, data() {
    return {
      avatar: avatar
    }
  },
  methods: {
    toggleSideBar() {
      // this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }, handleSave() {
      this.$emit('handleSave', null)
    }, handleNew() {
      if (this.userid) {
        this.$emit('handleNew', null)
      } else {
        this.$emit('openLogin', null)
      }
      // this.$emit('handleOpen', null)
    }, handleOpen() {
      if (this.userid) {
        this.$refs.articlelist.open()
      } else {
        this.$emit('openLogin', null)
      }
      // this.$emit('handleOpen', null)
    }, doOpen(content) {
      this.$emit('handleOpen', content)
    }, handlePreview() {
      this.$refs.preview.open(this.$parent.comp)
      // this.$emit('handlePreview', null)
    }, handleToWX() {
      this.$refs.copytowx.open(this.$parent.comp)
    }, openLogin() {
      this.$emit('openLogin', null)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  background: linear-gradient(to right,#d3e7fb,#bfe6ba);
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 9;

  .title{
    float: left;
    font-size: 1.5em;
    line-height: 50px;
    padding-left: 1em;
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    margin-right: 80px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
