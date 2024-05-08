<template>
  <div class="sidebar-container" style="width: 80px !important;">
    <div class="el-scrollbar">
      <div class="sidebar-logo-container">
        <transition name="sidebarLogoFade">
          <router-link class="sidebar-logo-link" to="/">
            <img v-if="logo" :src="logo" class="sidebar-logo">
            <h1 v-else class="sidebar-title">{{ title }} </h1>
          </router-link>
        </transition>
      </div>
      <el-scrollbar wrap-class="scrollbar-wrapper ts-wrapper">
        <el-menu
          :default-active="activeMenu"
          :collapse="false"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :unique-opened="false"
          active-text-color="#ccc"
          :collapse-transition="false"
          mode="vertical"
          @select="menuSelect"
        >
          <el-menu-item index="1">
            <svg-icon icon-class="form" />
            <span slot="title">样式模板</span>
          </el-menu-item>
          <el-menu-item index="2">
            <svg-icon icon-class="table" />
            <span slot="title">剪切板</span>
          </el-menu-item>
          <el-menu-item index="3">
            <svg-icon icon-class="table" />
            <span slot="title">收藏中心</span>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>

import variables from '@/styles/variables.scss'
export default {
  components: {
  },
  props: {
    activeMenu: {
      required: true,
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      title: '图文排版',
      logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
    }
  },
  computed: {
    variables() {
      return variables
    }
  },
  methods: {
    menuSelect(val) {
      // this.activeMenu = val
      this.$emit('menuSelect', val)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

  .sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
  }

  .sidebarLogoFade-enter,
  .sidebarLogoFade-leave-to {
    opacity: 0;
  }

  .sidebar-logo-container {
    position: relative;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #2b2f3a;
    text-align: center;
    overflow: hidden;

    & .sidebar-logo-link {
      height: 100%;
      width: 100%;

      & .sidebar-logo {
        width: 32px;
        height: 32px;
        vertical-align: middle;
        margin-right: 12px;
      }

      & .sidebar-title {
        display: inline-block;
        margin: 0;
        color: #fff;
        font-weight: 600;
        line-height: 50px;
        font-size: 14px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        vertical-align: middle;
      }
    }

    &.collapse {
      .sidebar-logo {
        margin-right: 0px;
      }
    }
  }

  .wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .item {
    width: 300px;
    height: 50px;
    background-color: #42b983;
    color: #ffffff;
  }
</style>

