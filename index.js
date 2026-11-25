'use strict'

function loadSchema() {
  try {
    const loaded = require('@deepseek-ai/schemastery')
    return loaded.default || loaded
  } catch {
    try {
      if (typeof require.main?.require !== 'function') return undefined
      const loaded = require.main.require('@deepseek-ai/schemastery')
      return loaded.default || loaded
    } catch {
      return undefined
    }
  }
}

const z = loadSchema()

const toggle = description => z.union([
  z.const('0').description('关闭'),
  z.const('1').description('开启'),
]).default('1').description(description).volatile()

const Config = z?.object({
  enabled: toggle('启用 Vice City 主题').description('启用配色替换与界面装饰'),
  background: toggle('显示主视觉与画报').description('显示会话主视觉横幅、右栏画报与空状态场景'),
  opacity: z.string().pattern(/^(0|[1-9]\d?|100)$/).default('72').description('背景不透明度（0–100%）').volatile(),
  blur: z.string().pattern(/^([0-9]|1\d|2[0-4])$/).default('0').description('背景模糊（0–24px）').volatile(),
  glow: toggle('启用霓虹光晕').description('为标题、边框与按钮添加霓虹光晕'),
  motion: toggle('启用界面动效').description('消息进入动画与工具行扫光；遵循系统减少动态效果设置'),
  intro: toggle('启用开场动画').description('首次加载时播放的 VI 开场动画'),
  pet: toggle('显示桌面宠物').description('右下角的 Jason 与 Lucia，可拖动；跟随 Agent 状态变化'),
})

function apply() {}

module.exports = { name: 'dsh-gta6', Config, apply }
