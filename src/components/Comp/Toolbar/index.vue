<template>
  <div>
    <!-- 主工具条 -->
    <div ref="container" v-tool-drag class="mce-tinymce mce-tinymce-inline mce-container mce-panel mce-floatpanel" tabindex="-1" style="border-width: 1px; z-index: 1998; left: 0; top: 0; width: 396px; height: 40px; position: absolute;display: none;">
      <div class="mce-container-body mce-abs-layout" style="height: 40px;">
        <div class="mce-abs-end" />
        <div class="mce-toolbar-grp mce-container mce-panel mce-abs-layout-item mce-first mce-last" tabindex="-1" style="left: 0px; top: 0px; height: 40px;">
          <div class="mce-container-body mce-stack-layout" style="height: 40px;">
            <div class="mce-container mce-toolbar mce-stack-layout-item mce-first mce-last">
              <div class="mce-container-body mce-flow-layout">
                <div class="mce-container mce-flow-layout-item mce-first mce-last mce-btn-group">
                  <div>
                    <!--
                  <div class="mce-widget mce-btn mce-active" tabindex="-1">
                    <button type="button" tabindex="-1" style="color: red;"><svg-icon icon-class="align-top" /></button>
                  </div>
                  -->
                    <div :class="aimClass()" tabindex="-1" title="选择">
                      <button type="button" tabindex="-1" @click.stop="aim"><svg-icon icon-class="aim" style="font-size: 1.3em;" /></button>
                    </div>
                    <div class="mce-widget mce-btn" tabindex="-1" title="复制/粘贴">
                      <button type="button" tabindex="-1" style="padding: 3px 4px;" @click.stop="handleCopyCommand('copy')">
                        复制
                      </button>
                      <el-dropdown trigger="click" @command="handleCopyCommand">
                        <button type="button" tabindex="-1" style="padding: 3px 4px;">
                          <i class="el-icon-caret-bottom" />
                        </button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="copy">复制</el-dropdown-item>
                          <el-dropdown-item command="shear">剪切</el-dropdown-item>
                          <el-dropdown-item command="paste">粘贴</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>

                    <div v-if="value && value.type === 'row' && isDesign" title="插入列" class="mce-widget mce-btn" tabindex="-1" aria-pressed="false">
                      <button type="button" tabindex="-1" @click.stop="insertCell"><svg-icon icon-class="col" style="font-size: 1.5em;" /></button>
                    </div>
                    <!-- 列插入/删除 -->
                    <div v-if="value && value.type === 'cell' " title="列插入/删除" class="mce-widget mce-btn" tabindex="-1">
                      <el-dropdown trigger="click" @command="handleCellCommand">
                        <button type="button" tabindex="-1" style="padding: 3px 4px;">
                          <svg-icon icon-class="col" style="font-size: 1.5em;" />
                        </button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="insert-left">在左侧插入1列</el-dropdown-item>
                          <el-dropdown-item command="insert-right">在右侧插入1列</el-dropdown-item>
                          <el-dropdown-item command="delete" divided>删除当前列</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                    <div v-if="value && value.type === 'cell'" title="对齐" class="mce-widget mce-btn" tabindex="-1">
                      <el-dropdown trigger="click" @command="handleAlignCommand">
                        <button type="button" tabindex="-1" style="padding: 3px 4px;">
                          <svg-icon v-if="!value.attrs.align || value.attrs.align === 'top'" icon-class="align-top" style="font-size: 1.5em;" />
                          <svg-icon v-else-if="value.attrs.align === 'middle'" icon-class="align-middle" style="font-size: 1.5em;" />
                          <svg-icon v-else-if="value.attrs.align === 'bottom'" icon-class="align-bottom" style="font-size: 1.5em;" />
                          <svg-icon v-else-if="value.attrs.align === 'top-bottom'" icon-class="align-top-bottom" style="font-size: 1.5em;" />
                        </button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="top" :class="{'active':value.attrs.align === 'top'}"><svg-icon icon-class="align-top" style="font-size: 1.5em;" /> 向上对齐</el-dropdown-item>
                          <el-dropdown-item command="middle" :class="{'active':value.attrs.align === 'middle'}"><svg-icon icon-class="align-middle" style="font-size: 1.5em;" /> 垂直居中</el-dropdown-item>
                          <el-dropdown-item command="bottom" :class="{'active':value.attrs.align === 'bottom'}"><svg-icon icon-class="align-bottom" style="font-size: 1.5em;" /> 向下对齐</el-dropdown-item>
                          <el-dropdown-item command="top-bottom" :class="{'active':value.attrs.align === 'top-bottom'}"><svg-icon icon-class="align-top-bottom" style="font-size: 1.5em;" /> 拉伸</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                    <div v-if="value && value.type === 'cell'" title="宽度" class="mce-widget mce-btn" tabindex="-1">
                      <div v-if="!value.attrs.widthType || value.attrs.widthType === '%'" style="display: inline-block;">
                        <span style="line-height: 24px;margin-left: 5px;">宽</span>
                        <el-input-number
                          v-model="value.attrs.width"
                          :controls="false"
                          placeholder=""
                          style="width: 60px"
                        />
                        <span style="line-height: 24px;">%</span>
                      </div>
                      <div v-else-if="value && value.attrs.widthType === 'px'" style="display: inline-block;line-height: 32px;">
                        <span style="line-height: 24px;margin-left: 5px;">宽</span>
                        <el-input-number
                          v-model="value.attrs.width"
                          :controls="false"
                          placeholder=""
                          style="width: 60px"
                        />
                        <span style="line-height: 24px;">px</span>
                      </div>
                      <div v-else-if="value && value.attrs.widthType === 'auto'" style="display: inline-block;line-height: 32px;">
                        <span style="line-height: 24px;margin-left: 5px;">宽度自适应</span>
                      </div>
                      <div v-else-if="value && value.attrs.widthType === 'stretch'" style="display: inline-block;line-height: 32px;">
                        <span style="line-height: 24px;margin-left: 5px;">伸缩比</span>
                        <el-input-number
                          v-model="value.attrs.width"
                          :controls="false"
                          placeholder=""
                          style="width: 60px"
                        />
                      </div>
                      <el-dropdown trigger="click" @command="handleCellWidthCommand">
                        <button type="button" tabindex="-1" style="padding: 3px 4px;">
                          <i class="el-icon-caret-bottom" style="line-height: 18px;" />
                        </button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="%" :class="{'active':value && value.attrs.widthType === '%'}">宽度百分比</el-dropdown-item>
                          <el-dropdown-item command="px" :class="{'active':value && value.attrs.widthType === 'px'}">宽度固定像素</el-dropdown-item>
                          <el-dropdown-item command="auto" :class="{'active':value && value.attrs.widthType === 'auto'}">宽度自适应</el-dropdown-item>
                          <el-dropdown-item command="stretch" :class="{'active':value && value.attrs.widthType === 'stretch'}">宽度自伸缩</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>

                    <div v-if="value && value.type === 'shape'" title="高度" class="mce-widget mce-btn" tabindex="-1">
                      <div style="display: inline-block;">
                        <span style="line-height: 24px;margin-left: 5px;">高</span>
                        <el-input-number
                          v-model="value.attrs.height"
                          :controls="false"
                          placeholder=""
                          style="width: 60px"
                        />
                        <span style="line-height: 24px;margin-right: 5px;">px</span>
                      </div>
                    </div>

                    <div v-if="value && value.type === 'text' && isDesign" title="文本类型" class="mce-widget mce-btn" tabindex="-1">
                      <el-select v-model="value.textType" placeholder="文本类型" size="mini" class="edit-select" style="width: 80px">
                        <el-option
                          v-for="item in textTypes"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                    <div v-if="value && value.type === 'text' && isDesign" title="定位" class="mce-widget mce-btn" tabindex="-1">
                      <el-popover
                        placement="bottom"
                        width="300"
                        trigger="click"
                      >
                        <el-row>
                          <el-col :span="6"><label style="line-height: 36px;">缩放</label></el-col>
                          <el-col :span="18">
                            <el-input
                              v-model="value.attrs.zoom"
                              placeholder=""
                            >
                              <span slot="suffix" style="line-height: 38px;margin-right: 5px;">%</span>
                            </el-input>

                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6"><label style="line-height: 36px;">段前距</label></el-col>
                          <el-col :span="18">
                            <el-input
                              v-model="value.attrs.interval"
                              placeholder=""
                            >
                              <span slot="suffix" style="line-height: 38px;margin-right: 5px;">px</span>
                            </el-input>

                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6"><label style="line-height: 36px;">段后距</label></el-col>
                          <el-col :span="18">
                            <el-input
                              v-model="value.attrs.intervalAfter"
                              placeholder=""
                            >
                              <span slot="suffix" style="line-height: 38px;margin-right: 5px;">px</span>
                            </el-input>

                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6"><label style="line-height: 36px;">对齐</label></el-col>
                          <el-col :span="18">
                            <el-radio-group v-model="value.attrs.textAlign" size="small">
                              <el-radio-button label="left"><svg-icon icon-class="align-left" style="font-size: 1.5em;" /></el-radio-button>
                              <el-radio-button label="center"><svg-icon icon-class="align-v-middle" style="font-size: 1.5em;" /></el-radio-button>
                              <el-radio-button label="right"><svg-icon icon-class="align-right" style="font-size: 1.5em;" /></el-radio-button>
                            </el-radio-group>

                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6"><label style="line-height: 36px;">偏移</label></el-col>
                          <el-col :span="18">
                            <el-input
                              v-model="value.attrs.deviation"
                              placeholder=""
                            >
                              <span slot="suffix" style="line-height: 38px;margin-right: 5px;">px</span>
                            </el-input>

                          </el-col>
                        </el-row>
                        <button slot="reference" type="button" tabindex="-1">定位</button>
                      </el-popover>
                    </div>

                    <div v-if="value && value.type !== 'img' && value.type !== 'text' && isDesign" title="边框" class="mce-widget mce-btn" tabindex="-1">
                      <el-popover
                        placement="bottom"
                        width="580"
                        trigger="click"
                      >
                        <el-row>
                          <el-col :span="3">
                            <label style="line-height: 36px;">全部：</label>
                          </el-col>

                          <el-col :span="5">
                            <el-select v-model="value.attrs.borderType" style="width: 100%;" placeholder="样式">
                              <el-option
                                v-for="item in borderStyleOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </el-col>
                          <el-col :span="5">
                            <el-input
                              v-model="value.attrs.borderSize"
                              placeholder="尺寸"
                            >
                              <span slot="suffix" style="line-height: 38px;margin-right: 5px;">px</span>
                            </el-input>
                          </el-col>
                          <el-col :span="8">
                            <el-input v-model="value.attrs.radius" placeholder="弧度" class="input-with-select">
                              <el-select slot="append" v-model="value.attrs.radiusType" style="width: 70px;" placeholder="">
                                <el-option label="px" value="px" />
                                <el-option label="%" value="%" />
                              </el-select>
                            </el-input>
                          </el-col>
                          <el-col :span="3">
                            <el-color-picker v-model="value.attrs.borderColor" />
                          </el-col>
                        </el-row>

                        <el-row>
                          <el-col :span="3">
                            <label style="line-height: 36px;">上边框：</label>
                          </el-col>

                          <el-col :span="5">
                            <el-select v-model="value.attrs.borderTopType" style="width: 100%;" placeholder="样式">
                              <el-option
                                v-for="item in borderStyleOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </el-col>
                          <el-col :span="5">
                            <el-input
                              v-model="value.attrs.borderTopSize"
                              placeholder="尺寸"
                            >
                              <span slot="suffix" style="line-height: 38px;margin-right: 5px;">px</span>
                            </el-input>
                          </el-col>
                          <el-col :span="8">
                            <el-input v-model="value.attrs.radiusTop" placeholder="弧度" class="input-with-select">
                              <el-select slot="append" v-model="value.attrs.radiusTopType" style="width: 70px;" placeholder="">
                                <el-option label="px" value="px" />
                                <el-option label="%" value="%" />
                              </el-select>
                            </el-input>
                          </el-col>
                          <el-col :span="3">
                            <el-color-picker v-model="value.attrs.borderTopColor" />
                          </el-col>
                        </el-row>

                        <el-row>
                          <el-col :span="3">
                            <label style="line-height: 36px;">右边框：</label>
                          </el-col>

                          <el-col :span="5">
                            <el-select v-model="value.borderRightType" style="width: 100%;" placeholder="样式">
                              <el-option
                                v-for="item in borderStyleOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </el-col>
                          <el-col :span="5">
                            <el-input
                              v-model="value.attrs.borderRightSize"
                              placeholder="尺寸"
                            >
                              <span slot="suffix" style="line-height: 38px;margin-right: 5px;">px</span>
                            </el-input>
                          </el-col>
                          <el-col :span="8">
                            <el-input v-model="value.attrs.radiusRight" placeholder="弧度" class="input-with-select">
                              <el-select slot="append" v-model="value.attrs.radiusRightType" style="width: 70px;" placeholder="">
                                <el-option label="px" value="px" />
                                <el-option label="%" value="%" />
                              </el-select>
                            </el-input>
                          </el-col>
                          <el-col :span="3">
                            <el-color-picker v-model="value.attrs.borderRightColor" />
                          </el-col>
                        </el-row>

                        <el-row>
                          <el-col :span="3">
                            <label style="line-height: 36px;">下边框：</label>
                          </el-col>

                          <el-col :span="5">
                            <el-select v-model="value.attrs.borderBottomType" style="width: 100%;" placeholder="样式">
                              <el-option
                                v-for="item in borderStyleOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </el-col>
                          <el-col :span="5">
                            <el-input
                              v-model="value.attrs.borderBottomSize"
                              placeholder="尺寸"
                            >
                              <span slot="suffix" style="line-height: 38px;margin-right: 5px;">px</span>
                            </el-input>
                          </el-col>
                          <el-col :span="8">
                            <el-input v-model="value.attrs.radiusBottom" placeholder="弧度" class="input-with-select">
                              <el-select slot="append" v-model="value.attrs.radiusBottomType" style="width: 70px;" placeholder="">
                                <el-option label="px" value="px" />
                                <el-option label="%" value="%" />
                              </el-select>
                            </el-input>
                          </el-col>
                          <el-col :span="3">
                            <el-color-picker v-model="value.attrs.borderBottomColor" />
                          </el-col>
                        </el-row>

                        <el-row>
                          <el-col :span="3">
                            <label style="line-height: 36px;">左边框：</label>
                          </el-col>

                          <el-col :span="5">
                            <el-select v-model="value.attrs.borderLeftType" style="width: 100%;" placeholder="样式">
                              <el-option
                                v-for="item in borderStyleOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </el-col>
                          <el-col :span="5">
                            <el-input
                              v-model="value.attrs.borderLeftSize"
                              placeholder="尺寸"
                            >
                              <span slot="suffix" style="line-height: 38px;margin-right: 5px;">px</span>
                            </el-input>
                          </el-col>
                          <el-col :span="8">
                            <el-input v-model="value.attrs.radiusLeft" placeholder="弧度" class="input-with-select">
                              <el-select slot="append" v-model="value.attrs.radiusLeftType" style="width: 70px;" placeholder="">
                                <el-option label="px" value="px" />
                                <el-option label="%" value="%" />
                              </el-select>
                            </el-input>
                          </el-col>
                          <el-col :span="3">
                            <el-color-picker v-model="value.attrs.borderLeftColor" />
                          </el-col>
                        </el-row>

                        <button slot="reference" type="button" tabindex="-1">边框</button>
                      </el-popover>
                    </div>

                    <div v-if="value && isDesign" title="列定位" class="mce-widget mce-btn" tabindex="-1">
                      <el-popover
                        placement="bottom"
                        width="300"
                        trigger="click"
                      >
                        <el-row>
                          <el-col :span="24">
                            <h3 style="text-align: left;">列定位</h3>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="text-align: center">
                            <span>上</span>
                            <el-input-number
                              v-model="value.attrs.marginTop"
                              :controls="false"
                              placeholder=""
                              style="width: 80px"
                            />
                            <span>px</span>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="text-align: center">
                            <span>左</span>
                            <el-input-number
                              v-model="value.attrs.marginLeft"
                              :controls="false"
                              placeholder=""
                              style="width: 80px"
                            />
                            <span>px</span>
                            <span style="margin-left: 20px;">右</span>
                            <el-input-number
                              v-model="value.attrs.marginRight"
                              :controls="false"
                              placeholder=""
                              style="width: 80px"
                            />
                            <span>px</span>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="text-align: center">
                            <span>下</span>
                            <el-input-number
                              v-model="value.attrs.marginBottom"
                              :controls="false"
                              placeholder=""
                              style="width: 80px"
                            />
                            <span>px</span>
                          </el-col>
                        </el-row>
                        <button slot="reference" type="button" tabindex="-1">列定位</button>
                      </el-popover>
                    </div>

                    <div v-if="value" title="插入空行" class="mce-widget mce-btn" tabindex="-1" aria-pressed="false">
                      <el-dropdown split-button type="primary" @click="handleInsertRowClick" @command="handleInsertRowCommand">
                        <span v-if="this.insertRow === 'after'" style="line-height: 22px">后插空行</span>
                        <span v-else style="line-height: 22px">前插空行</span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="after">后插空行</el-dropdown-item>
                          <el-dropdown-item command="before">前插空行</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>

                    <div class="mce-widget mce-btn" title="删除" tabindex="-1" aria-pressed="false">
                      <button type="button" tabindex="-1" @click.stop="delNode"><svg-icon icon-class="delete" /></button>
                    </div>

                    <div class="mce-widget mce-btn" title="收藏" tabindex="-1">
                      <button type="button" tabindex="-1" style="padding: 3px 4px;" @click.stop="like()">
                        收藏
                      </button>
                    </div>

                    <div v-if="value && !value.target" title="更多设定" class="mce-widget mce-btn" tabindex="-1">
                      <el-popover
                        placement="bottom"
                        width="400"
                        trigger="click"
                      >
                        <el-row>
                          <el-col :span="6"><label style="line-height: 36px;">透明度</label></el-col>
                          <el-col :span="18"><el-slider v-model="value.attrs.opacity" /></el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6"><label style="line-height: 36px;">旋转</label></el-col>
                          <el-col :span="18"><el-slider v-model="value.attrs.rotate" :max="360" /></el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6"><label style="line-height: 36px;">翻转</label></el-col>
                          <el-col :span="18">
                            <el-radio-group v-model="value.attrs.rotateType">
                              <el-radio-button label="rotateX">上下翻转</el-radio-button>
                              <el-radio-button label="rotateY">左右翻转</el-radio-button>
                            </el-radio-group>
                          </el-col>
                        </el-row>
                        <el-row style="margin-top: 5px;">
                          <el-col :span="6">
                            <label style="line-height: 36px;">倒影</label>
                            <el-checkbox v-model="value.attrs.isReflect" style="float: right;line-height: 36px;margin-right: 5px;" />
                          </el-col>
                          <el-col :span="18">

                            <el-input
                              v-model="value.attrs.reflectSpace"
                              placeholder=""
                              style="width: 100px"
                            >
                              <span slot="suffix" style="line-height: 38px;margin-right: 5px;">间距</span>
                            </el-input>
                            <el-input
                              v-model="value.attrs.reflectOpacity"
                              placeholder=""
                              style="width: 100px"
                            >
                              <span slot="suffix" style="line-height: 38px;margin-right: 5px;">%隐藏</span>
                            </el-input>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="9"><el-button type="primary" @click="clearAttr">清除格式</el-button></el-col>
                        </el-row>

                        <button slot="reference" type="button" tabindex="-1"><svg-icon icon-class="wrench" /></button>
                      </el-popover>
                    </div>

                    <div v-if="value" class="mce-widget mce-btn" title="富媒体" tabindex="-1">
                      <button type="button" tabindex="-1" style="padding: 3px 4px;" @click.stop="media">
                        富媒体
                      </button>
                    </div>

                    <div v-if="value && (value.type === 'row' || value.type === 'cell' || value.type === 'shape')&& isDesign" title="背景颜色" class="mce-widget mce-btn" tabindex="-1" aria-pressed="false">
                      <el-color-picker v-model="value.attrs.backgroundColor" size="mini" show-alpha />
                    </div>
                    <div v-if="value && (value.type === 'row' || value.type === 'cell') && isDesign" class="mce-widget mce-btn" title="字体颜色" tabindex="-1" aria-pressed="false">
                      <el-color-picker v-model="value.attrs.color" size="mini" />
                    </div>

                    <!--                    <div v-if="value" class="mce-widget mce-btn " tabindex="-1" style="margin-left: 10px;">-->
                    <!--                      <span style="line-height: 26px;">{{ this.getTypeName(value.type) }}</span>-->
                    <!--                    </div>-->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ImageSelect ref="imageSelect" @imgSelected="imgSelected" />
      <ImageBorder ref="imageBorder" @imgBorderSelected="imgBorderSelected" />
      <ImagePrettify ref="imagePrettify" @imgFilterSelected="imgFilterSelected" />
    </div>
    <!-- 副工具条 -->
    <div ref="subcontainer" v-tool-drag class="mce-tinymce mce-tinymce-inline mce-container mce-panel mce-floatpanel" tabindex="-1" style="border-width: 1px; z-index: 1998; left: 0; top: 0; width: 396px; height: 40px; position: absolute;display: none;">
      <div class="mce-container-body mce-abs-layout" style="height: 40px;">
        <div class="mce-abs-end" />
        <div class="mce-toolbar-grp mce-container mce-panel mce-abs-layout-item mce-first mce-last" tabindex="-1" style="left: 0px; top: 0px; height: 40px;">
          <div class="mce-container-body mce-stack-layout" style="height: 40px;">
            <div class="mce-container mce-toolbar mce-stack-layout-item mce-first mce-last">
              <div class="mce-container-body mce-flow-layout">
                <div class="mce-container mce-flow-layout-item mce-first mce-last mce-btn-group">
                  <div>
                    <div v-if="value && value.type === 'img'" class="mce-widget mce-btn " tabindex="-1" style="margin-left: 10px;">
                      <span style="line-height: 26px;">{{ this.getTypeName(value.type) }}</span>
                    </div>
                    <div v-if="value && value.type === 'img' && !value.target" title="宽度" class="mce-widget mce-btn" tabindex="-1">
                      <el-popover
                        placement="bottom"
                        width="400"
                        trigger="click"
                      >
                        <el-row>
                          <el-col :span="4"><label style="line-height: 36px;">百分比</label></el-col>
                          <el-col :span="14">
                            <el-slider v-model="value.attrs.width" style="width: 90%" />
                          </el-col>
                          <el-col :span="6">
                            <el-input-number
                              v-model="value.attrs.width"
                              :controls="false"
                              placeholder=""
                              style="width: 70%;text-align: left;"
                            />
                            <span style="line-height: 38px;margin-right: 1px;">%</span>
                          </el-col>
                        </el-row>
                        <button slot="reference" type="button" tabindex="-1">宽度</button>
                      </el-popover>
                    </div>
                    <div v-if="value && value.type === 'img'" title="图片裁剪" class="mce-widget mce-btn" tabindex="-1">
                      <button type="button" tabindex="-1" @click.stop="handleImageCropper"><svg-icon icon-class="scissors" /></button>
                    </div>
                    <div v-if="value && value.type === 'img'" title="图片选择" class="mce-widget mce-btn" tabindex="-1" aria-pressed="false">
                      <button type="button" tabindex="-1" @click.stop="handleImageSelect"><svg-icon icon-class="image" /></button>
                    </div>
                    <div v-if="value && value.type === 'img'" title="边框阴影" class="mce-widget mce-btn" tabindex="-1" aria-pressed="false">
                      <button type="button" tabindex="-1" @click.stop="handleImageBorder">边框阴影</button>
                    </div>
                    <div v-if="value && value.type === 'img'" title="编辑美化" class="mce-widget mce-btn" tabindex="-1" aria-pressed="false">
                      <button type="button" tabindex="-1" @click.stop="handleImagePrettify">编辑美化</button>
                    </div>

                    <div v-if="value && value.type === 'text'" title="字体" class="mce-widget mce-btn" tabindex="-1" style="margin-left: 8px;">
                      <el-select v-model="textFont" placeholder="字体" size="mini" class="edit-select" style="width: 80px" @change="textFontchange">
                        <el-option
                          v-for="item in fonts"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                    <div v-if="value && value.type === 'text'" title="字号" class="mce-widget mce-btn" tabindex="-1">
                      <el-select v-model="textFontSize" placeholder="" size="mini" class="edit-select" style="width: 50px" @change="textFontSizechange">
                        <el-option
                          v-for="item in fontSizes"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                    <div v-if="value && value.type === 'text'" title="背景颜色" class="mce-widget mce-btn color-pick" tabindex="-1" aria-pressed="false">
                      <el-color-picker ref="backColor" v-model="backColor" size="mini" @change="backColorChange" />
                      <svg-icon icon-class="backgroundcolor" style="font-size: 1.3em;" @click.stop="openPickBackColor" />
                    </div>
                    <div v-if="value && value.type === 'text'" title="字体颜色" class="mce-widget mce-btn color-pick" tabindex="-1" aria-pressed="false">
                      <el-color-picker ref="fontColor" v-model="fontColor" size="mini" @change="fontColorChange" />
                      <svg-icon icon-class="fontcolor" style="font-size: 1.3em;" @click.stop="openPickFontColor" />
                    </div>
                    <div v-if="value && value.type === 'text'" title="粗体" :class="{'mce-widget': true,'mce-btn': true,'mce-active': this.isBold}" tabindex="-1" aria-pressed="false">
                      <button type="button" tabindex="-1" @click.stop="bold"><svg-icon icon-class="bold" style="font-size: 1.3em;" /></button>
                    </div>
                    <div v-if="value && value.type === 'text'" title="斜体" :class="{'mce-widget': true,'mce-btn': true,'mce-active': this.isItalics}" tabindex="-1" aria-pressed="false">
                      <button type="button" tabindex="-1" @click.stop="italics"><svg-icon icon-class="Italics" style="font-size: 1.3em;" /></button>
                    </div>
                    <div v-if="value && value.type === 'text'" title="下划线" :class="{'mce-widget': true,'mce-btn': true,'mce-active': this.isUnderline}" tabindex="-1" aria-pressed="false">
                      <button type="button" tabindex="-1" @click.stop="underline"><svg-icon icon-class="underline" style="font-size: 1.3em;" /></button>
                    </div>
                    <div v-if="value && value.type === 'text'" title="删除线" :class="{'mce-widget': true,'mce-btn': true,'mce-active': this.isDeleteline}" tabindex="-1" aria-pressed="false">
                      <button type="button" tabindex="-1" @click.stop="deleteline"><svg-icon icon-class="deleteline" style="font-size: 1.3em;" /></button>
                    </div>

                    <div v-if="value && value.type === 'text'" title="居左对齐" :class="{'mce-widget': true,'mce-btn': true,'mce-active': this.isJustifyLeft}" tabindex="-1" aria-pressed="false">
                      <button type="button" tabindex="-1" @click.stop="justifyLeft"><svg-icon icon-class="text-align-left" style="font-size: 1.3em;" /></button>
                    </div>
                    <div v-if="value && value.type === 'text'" title="居中对齐" :class="{'mce-widget': true,'mce-btn': true,'mce-active': this.isJustifyCenter}" tabindex="-1" aria-pressed="false">
                      <button type="button" tabindex="-1" @click.stop="justifyCenter"><svg-icon icon-class="text-align-center" style="font-size: 1.3em;" /></button>
                    </div>
                    <div v-if="value && value.type === 'text'" title="居右对齐" :class="{'mce-widget': true,'mce-btn': true,'mce-active': this.isJustifyRight}" tabindex="-1" aria-pressed="false">
                      <button type="button" tabindex="-1" @click.stop="justifyRight"><svg-icon icon-class="text-align-right" style="font-size: 1.3em;" /></button>
                    </div>
                    <div v-if="value && value.type === 'text'" title="两端对齐" :class="{'mce-widget': true,'mce-btn': true,'mce-active': this.isJustifyFull}" tabindex="-1" aria-pressed="false">
                      <button type="button" tabindex="-1" @click.stop="justifyFull"><svg-icon icon-class="text-align-justify" style="font-size: 1.3em;" /></button>
                    </div>

                    <div v-if="value && value.type === 'text'" title="文字分段" :class="{'mce-widget': true,'mce-btn': true}" tabindex="-1" aria-pressed="false">
                      <button type="button" tabindex="-1" @click.stop="split"><svg-icon icon-class="separate" style="font-size: 1.3em;" /></button>
                    </div>

                    <div v-if="value && value.type === 'text'" title="间距" class="mce-widget mce-btn" tabindex="-1">
                      <el-popover
                        placement="bottom"
                        width="300"
                        trigger="click"
                      >
                        <el-row>
                          <el-col :span="6"><label style="line-height: 36px;">行间距</label></el-col>
                          <el-col :span="18">
                            <el-input
                              v-model="value.attrs.lineHeight"
                              placeholder=""
                            >
                              <span slot="suffix" style="line-height: 38px;margin-right: 5px;">倍</span>
                            </el-input>

                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6"><label style="line-height: 36px;">字间距</label></el-col>
                          <el-col :span="18">
                            <el-input
                              v-model="value.attrs.letterSpacing"
                              placeholder=""
                            >
                              <span slot="suffix" style="line-height: 38px;margin-right: 5px;">px</span>
                            </el-input>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6"><label style="line-height: 36px;">左边距</label></el-col>
                          <el-col :span="18">
                            <el-input
                              v-model="value.attrs.paddingLeft"
                              placeholder=""
                            >
                              <span slot="suffix" style="line-height: 38px;margin-right: 5px;">px</span>
                            </el-input>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6"><label style="line-height: 36px;">右边距</label></el-col>
                          <el-col :span="18">
                            <el-input
                              v-model="value.attrs.paddingRight"
                              placeholder=""
                            >
                              <span slot="suffix" style="line-height: 38px;margin-right: 5px;">px</span>
                            </el-input>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6"><label style="line-height: 36px;">上边距</label></el-col>
                          <el-col :span="18">
                            <el-input
                              v-model="value.attrs.paddingTop"
                              placeholder=""
                            >
                              <span slot="suffix" style="line-height: 38px;margin-right: 5px;">px</span>
                            </el-input>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6"><label style="line-height: 36px;">下边距</label></el-col>
                          <el-col :span="18">
                            <el-input
                              v-model="value.attrs.paddingBottom"
                              placeholder=""
                            >
                              <span slot="suffix" style="line-height: 38px;margin-right: 5px;">px</span>
                            </el-input>
                          </el-col>
                        </el-row>
                        <button slot="reference" type="button" tabindex="-1">间距</button>
                      </el-popover>
                    </div>

                    <el-dropdown v-if="value && value.type === 'text'" title="格式" trigger="click" @command="handleFormatCommand">
                      <span style="line-height: 30px;cursor: pointer;">格式</span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="indent">首行缩进</el-dropdown-item>
                        <el-dropdown-item command="insertUnorderedList" divided>编号列表</el-dropdown-item>
                        <el-dropdown-item command="insertOrderedList">数字列表</el-dropdown-item>
                        <el-dropdown-item command="superscript" divided>文字上标</el-dropdown-item>
                        <el-dropdown-item command="subscript">文字下标</el-dropdown-item>
                        <el-dropdown-item command="direction-ltr" divided>横排文字(从左至右)</el-dropdown-item>
                        <el-dropdown-item command="direction-rtl">横排文字(从右至左)</el-dropdown-item>
                        <el-dropdown-item command="vertical-rl">竖排文字(从右至左)</el-dropdown-item>
                        <el-dropdown-item command="vertical-lr">竖排文字(从左至右)</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 图片选择 -->
    <ImageSelect ref="imageSelect" @imgSelected="imgSelected" />
    <!-- 图片边框 -->
    <ImageBorder ref="imageBorder" @imgBorderSelected="imgBorderSelected" />
    <!-- 图片美化 -->
    <ImagePrettify ref="imagePrettify" @imgFilterSelected="imgFilterSelected" />
    <!-- 图片剪裁 -->
    <ImageCropper ref="imageCropper" @imgSelected="imgSelected" />
  </div>
</template>

<script>
import toolDrag from '@/directive/tool-drag'
import ImageSelect from '@/components/TSimage/select'
import ImageBorder from '@/components/TSimage/border'
import ImagePrettify from '@/components/TSimage/prettify'
import ImageCropper from '@/components/TSimage/cropper'
export default {
  directives: {
    toolDrag
  },
  components: {
    ImageSelect,
    ImageBorder,
    ImagePrettify,
    ImageCropper
  },
  props: {
    value: {
      required: false,
      type: Object,
      default: null
    }, root: {// 根节点
      required: false,
      type: Object,
      default: null
    },
    isArticle: {// true：是文章  false：是模板
      required: false,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dom: null,
      domId: null,
      insertRow: 'after', // 插入行类型
      aimed: false, // 瞄准模式
      isBold: false, // 粗体
      isItalics: false, // 斜体
      isUnderline: false, // 下划线
      isDeleteline: false, // 删除线
      isJustifyCenter: false, // 居中
      isJustifyLeft: false, // 居左
      isJustifyRight: false, // 居右
      isJustifyFull: false, // 两端对齐
      isIndent: false, // 缩进
      aimDom: null, // 瞄准的dom
      textFont: '', // 文本字体
      fonts: [ // 字体选项
        {
          value: '',
          label: '默认字体'
        }, {
          value: '"Microsoft YaHei"',
          label: '微软雅黑'
        }, {
          value: 'SimSun',
          label: '宋体'
        }
      ],
      textFontSize: 12, // 字体大小
      fontSizes: [ // 字体大小选项
        {
          value: '8',
          label: '8'
        }, {
          value: '10',
          label: '10'
        }, {
          value: '12',
          label: '12'
        }, {
          value: '14',
          label: '14'
        }, {
          value: '18',
          label: '18'
        }, {
          value: '24',
          label: '24'
        }, {
          value: '36',
          label: '36'
        }
      ],
      fontColor: null, // 字体颜色
      backColor: null, // 背景颜色
      textTypes: [ // 文本类型
        {
          value: '',
          label: ' '
        }, {
          value: 'title',
          label: '小标题'
        }, {
          value: 'important',
          label: '重点文本'
        }, {
          value: 'content',
          label: '正文文本'
        }, {
          value: 'component',
          label: '组件'
        }, {
          value: 'guid',
          label: '引导'
        }, {
          value: 'fixed',
          label: '固定'
        }
      ],
      borderStyleOptions: [ // 边框类型选项
        {
          value: '',
          label: '无边框'
        }, {
          value: 'solid',
          label: '实线'
        }, {
          value: 'dashed',
          label: '虚线'
        }, {
          value: 'dotted',
          label: '点状'
        }, {
          value: 'double',
          label: '双线'
        }, {
          value: 'groove',
          label: '凹槽'
        }, {
          value: 'ridge',
          label: '垄状'
        }, {
          value: 'inset',
          label: '内置框'
        }, {
          value: 'outset',
          label: '外置框'
        }]
    }
  },
  computed: {
    // 设计模式
    isDesign() {
      return this.root.data.editmode === 'design'
    }
  },
  methods: {
    // 工具条显示
    show(dom) {
      // 主工具条
      const container = this.$refs.container
      // 副工具条
      const sub = this.$refs.subcontainer
      if (this.dom !== dom) {
        this.aimed = false
        this.dom = dom
        const pos = this.dom.getBoundingClientRect()
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        // 计算top位置
        // let top = dom.offsetTop
        let top = pos.top - 75 + scrollTop
        if (!this.isArticle) {
          top = top - 55
        }
        let left = dom.offsetLeft

        top = top - 30
        sub.style.display = 'none'

        if (this.value.type === 'text') {
          // 文本控件
          // if (!this.isArticle) {
          //   top = top - 85
          // } else {
          //   top = top - 45
          // }

          top = top - 5
          // container.style.width = '340px'
          if (this.domId !== dom.id) sub.style.top = top + 'px'
          top = top - 46
          if (this.domId !== dom.id) {
            sub.style.left = left + 'px'
            sub.style.display = 'block'
          }
        } else if (this.value.type === 'img') {
          // 图片控件
          // container.style.width = '620px'
          // left = left - 130
          if (this.domId !== dom.id) sub.style.top = top + 'px'
          top = top - 46
          if (this.domId !== dom.id) sub.style.left = left + 'px'
          if (this.domId !== dom.id) sub.style.display = 'block'
        } else if (this.value.type === 'cell') {
          // 单元格控件
          // container.style.width = '640px'
          left = left - 140
          // 在快速模式下不可编辑
          if (!this.isDesign) {
            container.style.display = 'none'
            return
          }
        } else if (this.value.type === 'row') {
          // 行控件
          // container.style.width = '440px'
        } else if (this.value.type === 'shape') {
          // 形状控件
          // container.style.width = '540px'
          left = left - 60
          // 在快速模式下不可编辑
          if (!this.isDesign) {
            container.style.display = 'none'
            return
          }
        } else {
          container.style.display = 'none'
          return
        }

        if (this.domId !== dom.id) {
          container.style.top = top + 'px'
          container.style.left = left + 'px'
        }
        this.domId = dom.id
      }

      // 设置工具条宽度
      this.setBarWidth()
      container.style.display = 'block'
    },
    // 设置工具条宽度
    setBarWidth() {
      const container = this.$refs.container
      const sub = this.$refs.subcontainer
      // 主工具条宽度
      let w = 510
      // 副工具条宽度
      let sw = 410
      if (this.value.type === 'text') {
        // 文本
        w = 395
        sw = 660
      } else if (this.value.type === 'img') {
        // 图片
        w = 395
        sw = 330
      } else if (this.value.type === 'cell') {
        // 单元格
        w = 395
      } else if (this.value.type === 'row') {
        // 行
        w = 395
      } else if (this.value.type === 'shape') {
        // 形状
        w = 395
      }

      if (this.isDesign) {
        // 设计模式
        if (this.value.type === 'text') {
          w += 190
        } else if (this.value.type === 'img') {
          w += 60
        } else if (this.value.type === 'cell') {
          w += 400
        } else if (this.value.type === 'row') {
          w += 220
        } else if (this.value.type === 'shape') {
          w += 255
        }
      } else {
        // 快速模式
        if (!this.aimed) {
          w = 215
        }
      }
      // if (this.isArticle) {
      //   w += 45
      // }

      container.style.width = w + 'px'
      sub.style.width = sw + 'px'
    },
    // 隐藏工具条
    hide() {
      this.aimed = false
      this.dom = null
      this.domId = null
      this.$refs.container.style.display = 'none'
      this.$refs.subcontainer.style.display = 'none'
      if (this.aimDom) {
        this.aimDom.style.display = 'none'
      }
    },
    // 测试
    test() {
      this.value.attrs.text = '哈哈'
    },
    // 执行对齐
    handleAlignCommand(command) {
      this.$set(this.value.attrs, 'align', command)
      const parent = this.root.getNodeById(this.value.parentId)
      if (parent) {
        if (command === 'top-bottom' || command === 'middle') {
          // 居下和居中时，父节点display = flex
          this.$set(parent.attrs, 'display', 'flex')
        } else {
          // 其余 父节点display = null
          this.$set(parent.attrs, 'display', null)
        }
      }
    },
    // 插入列命令执行
    handleCellCommand(command) {
      // 获取父节点
      const parent = this.root.getNodeById(this.value.parentId)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }

        // 获取节点索引index
        let index = 0
        let indexTemp = 0
        parent.children.forEach((item) => {
          if (item.id === this.value.id) {
            index = indexTemp
          }
          indexTemp++
        })

        // 新节点数据
        const newItem = {
          id: this.getNewId(),
          type: 'cell',
          parentId: parent.id,
          attrs: {
            width: 33,
            widthType: '%'
          },
          children: []
        }
        if (command === 'insert-left') {
          // 左边插入列
          parent.children.splice(index, 0, newItem)
        } else if (command === 'insert-right') {
          // 右边插入列
          parent.children.splice(index + 1, 0, newItem)
        } else if (command === 'delete') {
          // 删除列
          parent.children.splice(index, 1)
          this.$refs.container.style.display = 'none'
        }
        // parent.children.push()
        // parent.children.splice(0,1)
        // parent.children.push('')
        // parent.children.pop()
      }
    },
    // 设置列宽命令执行
    handleCellWidthCommand(command) {
      this.$set(this.value.attrs, 'widthType', command)
    },
    // 复制节点
    handleCopyCommand(command) {
      // 获取复制的数据
      const clipData = this.root.getMainNode(this.value)
      // 触发复制事件
      this.$emit('onClipboard', { type: command, data: clipData })
    },
    // 执行插入行
    handleInsertRowClick() {
      // 获取父节点
      const parent = this.root.getNodeById(this.value.parentId)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }

        // index
        let index = 0
        let indexTemp = 0
        parent.children.forEach((item) => {
          if (item.id === this.value.id) {
            index = indexTemp
          }
          indexTemp++
        })

        // 构建新节点数据
        const newItem = {
          id: this.getNewId(),
          type: 'text',
          parentId: parent.id,
          textType: 'content',
          attrs: {

          }
        }
        if (this.insertRow === 'before') {
          // 前插入行
          parent.children.splice(index, 0, newItem)
        } else if (this.insertRow === 'after') {
          // 后插入行
          parent.children.splice(index + 1, 0, newItem)
        }
      }
    },
    // 执行插入行命令
    handleInsertRowCommand(command) {
      // 记录插入行类型
      this.insertRow = command
      this.handleInsertRowClick()
    },
    // 图片选择
    handleImageSelect() {
      // 打开图片选择画面
      this.$refs.imageSelect.open()
    },
    // 图片边框
    handleImageBorder() {
      // 打开图片边框画面
      this.$refs.imageBorder.open(this.value)
    },
    // 图片剪裁
    handleImageCropper() {
      // 获取控件位置
      const pos = this.dom.getBoundingClientRect()
      // 打开图片剪裁画面
      this.$refs.imageCropper.open(this.value.attrs.src, pos)
    },
    // 图片美化
    handleImagePrettify() {
      // 打开图片美化画面
      this.$refs.imagePrettify.open(this.value)
    },
    // 获取新id
    getNewId() {
      return 'id-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
    },
    // 图片选择后的处理
    imgSelected(data) {
      if (this.value.target) {
        // 设置图片路径
        this.value.target.src = data.path
        this.value.target.setAttribute('data-mce-src', data.path)
        if (this.root.textUi) {
          this.root.textUi.acceptChange()
        }
      } else {
        this.value.resourceid = data.resourceid
        this.value.attrs.src = data.path
      }
    },
    // 执行设置边框
    _setBorder(item, border) {
      if (item && item.type === 'img') {
        if (this.value.target) { // 当指定了dom对象时，修改target对象的style
          if (border.border) {
            this.value.target.style.border = border.border
          }
          if (border['border_radius']) {
            this.value.target.style.borderRadius = border['border_radius']
          }
          if (border['border_color']) {
            this.value.target.style.borderColor = border['border_color']
          }
          if (border['box_shadow']) {
            this.value.target.style.boxShadow = border['box_shadow']
          }
          if (border['_webkit_box_reflect']) {
            this.value.target.style.webkitBoxReflect = border['_webkit_box_reflect']
          }
          if (border['_webkit_mask']) {
            this.value.target.style.webkitMask = border['_webkit_mask']
          }
          if (this.root.textUi) {
            this.value.target.setAttribute('data-mce-style', this.value.target.style.cssText)
            this.root.textUi.acceptChange()
          }
        } else { // 设置节点对象的边框属性值
          this.$set(item.attrs, 'border', border.border)
          this.$set(item.attrs, 'box_shadow', border['box_shadow'])
          this.$set(item.attrs, 'border_radius', border['border_radius'])
          this.$set(item.attrs, 'border_color', border['border_color'])
          this.$set(item.attrs, '_webkit_box_reflect', border['_webkit_box_reflect'])
          this.$set(item.attrs, '_webkit_mask', border['_webkit_mask'])
        }
      }
    },
    // 边框类型选择后处理
    imgBorderSelected(data) {
      if (!data) return
      this.root.changing++
      if (data.type === 'this') {
        // 应用到当前
        this._setBorder(this.value, data.border)
      } else {
        // 应用到全部
        this._setChildrenBorder(this.root.data.children, data.border)
      }
      const self = this
      setTimeout(function() {
        self.root.changing--
        // 记录操作
        self.root.record()
      }, 300)
    },
    // 设置子节点边框
    _setChildrenBorder(children, border) {
      if (children) {
        children.forEach((item) => {
          this._setBorder(item, border)
          this._setChildrenBorder(item.children, border)
        })
      }
    },
    // 设置图片滤镜
    imgFilterSelected(filter) {
      if (this.value.target) {
        if (filter) {
          this.value.target.style.filter = filter
        }
        this.value.target.setAttribute('data-mce-style', this.value.target.style.cssText)
        if (this.root.textUi) {
          this.root.textUi.acceptChange()
        }
      } else {
        this.$set(this.value.attrs, 'filter', filter)
      }

      this.root.record()
    },
    // 获取类型名称
    getTypeName(type) {
      if (type === 'row') {
        return '布局:'
      } else if (type === 'text') {
        return '文本:'
      } else if (type === 'img') {
        return '图片:'
      } else if (type === 'cell') {
        return ''
      } else if (type === 'shape') {
        return '形状:'
      } else {
        return ''
      }
    },
    // 清空节点属性
    clearAttr() {
      this.$set(this.value, 'attrs', {})
    },
    // 删除节点
    delNode() {
      this.root.delNode(this.value)
    },
    // 插入cell控件
    insertCell() {
      const newItem = {
        id: this.getNewId(),
        type: 'cell',
        parentId: this.value.id,
        attrs: {
          width: 33,
          widthType: '%'
        },
        children: []
      }
      this.value.children.splice(this.value.children.length + 1, 0, newItem)
    },
    // 瞄准时的class
    aimClass() {
      return {
        'mce-widget': true,
        'mce-btn': true,
        'mce-active': this.aimed
      }
    },
    // 启动瞄准状态
    aim() {
      this.aimed = !this.aimed
      this.getAimDom()
      if (!this.aimed) {
        this.aimDom.style.display = 'none'
      } else {
        this.aimDom.style.display = 'block'
        // 绘制瞄准遮罩框
        const targetDom = document.getElementById('aim_target')
        const pos = this.dom.getBoundingClientRect()

        targetDom.style.width = pos.width + 'px'
        targetDom.style.height = pos.height + 'px'
        targetDom.style.top = pos.top + 'px'
        targetDom.style.left = pos.left + 'px'
      }
      // 设置工具条宽度
      this.setBarWidth()
    },
    // 获取瞄准dom
    getAimDom() {
      this.aimDom = document.getElementById('aim_panel')
      if (!this.aimDom) {
        const divHtml =
          '<div class="aim-bg"></div>' +
          '<div id="aim_target" class="aim-target"><p>点击左边内容应用样式</p></div>'

        this.aimDom = document.createElement('div')
        this.aimDom.id = 'aim_panel'
        this.aimDom.className = 'aim-panel'
        this.aimDom.innerHTML = divHtml
        const mainDom = document.getElementById('ts_main')
        mainDom.appendChild(this.aimDom)

        this.aimDom.addEventListener('click', this.aimBgClick, false)
      }

      return this.aimDom
    },
    // 瞄准背景点击事件
    aimBgClick() {
      this.aimDom.style.display = 'none'
    },
    // 富文本
    media() {
      alert('开发中')
    },
    // 收藏
    like() {
      this.$emit('like', this.value)
    },
    // 粗体
    bold() {
      if (!this.root.activeNode || !this.root.textUi) {
        return
      }
      const editor = this.root.textUi.getEditor()
      // 执行粗体命令
      editor.execCommand('bold')
    },
    // 获取是否粗体
    boldStyle(editor, blocks) {
      this.isBold = false
      blocks.forEach((block) => {
        // const rng = editor.selection.getRng()
        // if (rng.startContainer.parentNode.localName === 'strong') {
        //   this.isBold = true
        // }
        const start = editor.selection.getStart()
        if (start.localName === 'strong') {
          this.isBold = true
        } else if (start.parentNode.localName === 'strong') {
          this.isBold = true
        }
      })
      /*
      global$1.each(blocks, function (block) {
        if(act==''){
          act = dom.getStyle(block,'text-indent')==indent2em_val ? 'remove' : 'add';
        }
        if( act=='add' ){
          dom.setStyle(block, 'text-indent', indent2em_val);
        }else{
          var style=dom.getAttrib(block,'style');
          var reg = new RegExp('text-indent:[\\s]*' + indent2em_val + ';', 'ig');
          style = style.replace(reg, '');
          dom.setAttrib(block,'style',style);
        }
      })
*/
    },
    // 斜体
    italics() {
      if (!this.root.activeNode || !this.root.textUi) {
        return
      }
      const editor = this.root.textUi.getEditor()
      editor.execCommand('italic')
    },
    // 获取是否斜体
    italicsStyle(editor, blocks) {
      this.isItalics = false
      blocks.forEach((block) => {
        const start = editor.selection.getStart()
        if (start.localName === 'em') {
          this.isItalics = true
        } else if (start.parentNode.localName === 'em') {
          this.isItalics = true
        }
      })
    },
    // 设置字体
    textFontchange() {
      if (!this.root.activeNode || !this.root.textUi) {
        return
      }
      const editor = this.root.textUi.getEditor()
      // 执行设置字体命令
      editor.execCommand('fontName', false, this.textFont)
    },
    // 获取目标的字体内容
    textFontStyle(editor, blocks) {
      blocks.forEach((block) => {
        const start = editor.selection.getStart()
        const f = editor.dom.getStyle(start, 'font-family')
        this.textFont = f
      })
    },
    // 设置字体大小
    textFontSizechange() {
      if (!this.root.activeNode || !this.root.textUi) {
        return
      }
      const editor = this.root.textUi.getEditor()
      editor.execCommand('fontSize', false, this.textFontSize + 'pt')
    },
    // 获取目标字体大小
    textFontSizeStyle(editor, blocks) {
      blocks.forEach((block) => {
        const start = editor.selection.getStart()
        const s = editor.dom.getStyle(start, 'font-size')
        if (s) {
          this.textFontSize = Number(s.replace('pt', ''))
        } else {
          this.textFontSize = 12
        }
      })
    },
    // 设置背景颜色
    backColorChange() {
      if (!this.root.activeNode || !this.root.textUi) {
        return
      }
      const editor = this.root.textUi.getEditor()
      editor.execCommand('backColor', false, this.backColor)
    },
    // 获取背景颜色
    backColorStyle(editor, blocks) {
      blocks.forEach((block) => {
        const start = editor.selection.getStart()
        const s = editor.dom.getStyle(start, 'background-color')
        if (s) {
          this.backColor = s
        } else {
          this.backColor = null
        }
      })
    },
    // 设置字体颜色
    fontColorChange() {
      if (!this.root.activeNode || !this.root.textUi) {
        return
      }
      const editor = this.root.textUi.getEditor()
      editor.execCommand('foreColor', false, this.fontColor)
    },
    // 获取字体颜色
    fontColorStyle(editor, blocks) {
      blocks.forEach((block) => {
        const start = editor.selection.getStart()
        const s = editor.dom.getStyle(start, 'color')
        if (s) {
          this.fontColor = s
        } else {
          this.fontColor = null
        }
      })
    },
    // 下划线
    underline() {
      if (!this.root.activeNode || !this.root.textUi) {
        return
      }
      const editor = this.root.textUi.getEditor()
      editor.execCommand('underline')
    },
    // 获取是否下划线
    underlineStyle(editor, blocks) {
      this.isUnderline = false
      blocks.forEach((block) => {
        const start = editor.selection.getStart()
        const s = editor.dom.getStyle(start, 'text-decoration')
        if (s === 'underline') {
          this.isUnderline = true
        } else {
          const p = start.parentNode
          const ps = editor.dom.getStyle(p, 'text-decoration')
          if (ps === 'underline') {
            this.isUnderline = true
          }
        }
      })
    },
    // 设置删除线
    deleteline() {
      if (!this.root.activeNode || !this.root.textUi) {
        return
      }
      const editor = this.root.textUi.getEditor()
      editor.execCommand('strikeThrough')
    },
    // 获取删除线
    deletelineStyle(editor, blocks) {
      this.isDeleteline = false
      blocks.forEach((block) => {
        const start = editor.selection.getStart()
        const s = editor.dom.getStyle(start, 'text-decoration')
        if (s === 'line-through') {
          this.isDeleteline = true
        } else {
          const p = start.parentNode
          const ps = editor.dom.getStyle(p, 'text-decoration')
          if (ps === 'line-through') {
            this.isDeleteline = true
          }
        }
      })
    },
    // 设置居左
    justifyLeft() {
      if (!this.root.activeNode || !this.root.textUi) {
        return
      }
      const editor = this.root.textUi.getEditor()
      editor.execCommand('justifyLeft')
    },
    // 获取居左
    justifyLeftStyle(editor, blocks) {
      this.isJustifyLeft = false
      blocks.forEach((block) => {
        const s = editor.dom.getStyle(block, 'text-align')
        if (s === 'left') {
          this.isJustifyLeft = true
        }
      })
    },
    // 设置居中
    justifyCenter() {
      if (!this.root.activeNode || !this.root.textUi) {
        return
      }
      const editor = this.root.textUi.getEditor()
      editor.execCommand('justifyCenter')
    },
    // 获取居中
    justifyCenterStyle(editor, blocks) {
      this.isJustifyCenter = false
      blocks.forEach((block) => {
        const s = editor.dom.getStyle(block, 'text-align')
        if (s === 'center') {
          this.isJustifyCenter = true
        }
      })
    },
    // 设置居右
    justifyRight() {
      if (!this.root.activeNode || !this.root.textUi) {
        return
      }
      const editor = this.root.textUi.getEditor()
      editor.execCommand('justifyRight')
    },
    // 获取居右
    justifyRightStyle(editor, blocks) {
      this.isJustifyRight = false
      blocks.forEach((block) => {
        const s = editor.dom.getStyle(block, 'text-align')
        if (s === 'right') {
          this.isJustifyRight = true
        }
      })
    },
    // 设置两端对齐
    justifyFull() {
      if (!this.root.activeNode || !this.root.textUi) {
        return
      }
      const editor = this.root.textUi.getEditor()
      editor.execCommand('justifyFull')
    },
    // 获取两端对齐
    justifyFullStyle(editor, blocks) {
      this.isJustifyFull = false
      blocks.forEach((block) => {
        const s = editor.dom.getStyle(block, 'text-align')
        if (s === 'justify') {
          this.isJustifyFull = true
        }
      })
    },
    // 获取文字分段内容
    split() {
      if (!this.root.activeNode || !this.root.textUi) {
        return
      }
      const editor = this.root.textUi.getEditor()
      const selection = editor.selection
      // 选中的文字
      const selText = selection.getContent()
      // A. Insert bookmark at current cursor positon using mceInsertContent
      // 在目标位置插入标记
      editor.execCommand('mceInsertContent', false, '<span class="marker">\ufeff</span>')
      // B. Create a range from start of text up to my bookmark.
      // 创建从开头到标记的选中区域
      const rng = selection.getRng(1)
      const rng2 = rng.cloneRange()
      // set start of range to begin of forst paragraph
      const start = editor.getBody().firstChild
      rng2.setStartBefore(start)
      const aEle = editor.getBody().getElementsByTagName('span')
      let mark = null
      for (let i = 0; i < aEle.length; i++) {
        if (aEle[i].className === 'marker') {
          mark = aEle[i]
        }
      }
      rng2.setEndBefore(mark)
      editor.selection.setRng(rng2)

      // 选中文字之前的文字
      const startText = editor.selection.getContent()
      editor.execCommand('mceInsertContent', false, '')
      editor.execCommand('selectAll')

      // 选中文字之后的文字
      const endText = editor.selection.getContent()
      const strList = []
      if (startText && startText !== '<p>&nbsp;</p>') strList.push(startText)
      if (selText && selText !== '<p>&nbsp;</p>') strList.push(selText)
      if (endText && endText !== '<p>&nbsp;</p>') strList.push(endText)
      // 处理分段内容
      this.handleSplit(strList)
    },
    // 打开字体颜色选择
    openPickFontColor() {
      const c = this.$refs.fontColor
      c.handleTrigger()
    },
    // 打开背景颜色选择
    openPickBackColor() {
      this.$refs.backColor.handleTrigger()
    },
    // 处理文字分段
    handleSplit(texts) {
      if (!texts || !texts.length) {
        return
      }

      // 文本编辑器
      const editor = this.root.textUi.getEditor()
      // 将内容设置为第一段内容
      editor.setContent(texts[0])

      // 插入剩下的分段内容
      for (let i = 1; i < texts.length; i++) {
        const text = texts[i]

        // 父节点
        const parent = this.root.getNodeById(this.value.parentId)
        if (parent) {
          if (!parent.children) {
            parent.children = []
          }

          // index
          let index = 0
          let indexTemp = 0
          parent.children.forEach((item) => {
            if (item.id === this.value.id) {
              index = indexTemp
            }
            indexTemp++
          })

          // 插入新文本
          const newItem = JSON.parse(JSON.stringify(this.value))
          newItem.id = this.getNewId()
          newItem.parentId = parent.id
          newItem.attrs.text = text
          parent.children.splice(index + i, 0, newItem)
        }
      }
    },
    // 格式命令
    handleFormatCommand(command) {
      if (!this.root.activeNode || !this.root.textUi) {
        return
      }
      const editor = this.root.textUi.getEditor()
      // editor.execCommand('justifyFull')

      if (command === 'indent') { // 缩进
        const indent2em_val = '2em'
        // editor.execCommand('indent', false, this.isIndent ? '' : 'indent2em_val)
        const blocks = editor.selection.getSelectedBlocks()
        blocks.forEach((block) => {
          const act = editor.dom.getStyle(block, 'text-indent') === indent2em_val ? 'remove' : 'add'
          if (act === 'add') {
            editor.dom.setStyle(block, 'text-indent', indent2em_val)
          } else {
            let style = editor.dom.getAttrib(block, 'style')
            const reg = new RegExp('text-indent:[\\s]*' + indent2em_val + ';', 'ig')
            style = style.replace(reg, '')
            editor.dom.setAttrib(block, 'style', style)
          }
        })
      } else if (command.indexOf('direction') === 0) { // 横排文字
        const vs = command.split('-')
        const blocks = editor.selection.getSelectedBlocks()
        blocks.forEach((block) => {
          editor.dom.setStyle(block, 'direction', vs[1])
        })
      } else if (command.indexOf('vertical') === 0) { // 竖排文字
        const blocks = editor.selection.getSelectedBlocks()
        blocks.forEach((block) => {
          editor.dom.setStyle(block, 'writing-mode', command)
          editor.dom.setStyle(block, 'word-break', 'break-all')
        })
      } else {
        // 执行格式命令
        editor.execCommand(command)
      }
    },
    // 获取缩进
    indentStyle(editor, blocks) {
      this.isIndent = false
      blocks.forEach((block) => {
        const s = editor.dom.getStyle(block, 'text-indent')
        if (s) {
          this.isIndent = true
        }
      })
    },
    // 设定文本工具条样式
    setTextBarStyle() {
      if (this.root.textUi) {
        const editor = this.root.textUi.getEditor()
        const blocks = editor.selection.getSelectedBlocks()
        this.boldStyle(editor, blocks)
        this.italicsStyle(editor, blocks)
        this.textFontStyle(editor, blocks)
        this.textFontSizeStyle(editor, blocks)
        this.backColorStyle(editor, blocks)
        this.fontColorStyle(editor, blocks)
        this.underlineStyle(editor, blocks)
        this.deletelineStyle(editor, blocks)
        this.justifyLeftStyle(editor, blocks)
        this.justifyCenterStyle(editor, blocks)
        this.justifyRightStyle(editor, blocks)
        this.justifyFullStyle(editor, blocks)
        // this.indentStyle(editor, blocks)
      }
    }
  }
}
</script>

<style>
  .cropper-panel{

  }
</style>

