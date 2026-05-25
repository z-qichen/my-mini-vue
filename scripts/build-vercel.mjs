import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const dist = resolve(root, 'dist')

// 1. 复制根目录 index.html 到 dist/
copyFileSync(resolve(root, 'index.html'), resolve(dist, 'index.html'))

// 2. 创建 dist/examples/ 目录，复制示例文件
mkdirSync(resolve(dist, 'examples'), { recursive: true })

const examples = ['tree.html', 'vModel.html']
examples.forEach(file => {
  let html = readFileSync(resolve(root, 'examples', file), 'utf-8')
  // 修正脚本路径：../dist/my-mini-vue.umd.js -> ../my-mini-vue.umd.js
  html = html.replace('../dist/my-mini-vue.umd.js', '../my-mini-vue.umd.js')
  writeFileSync(resolve(dist, 'examples', file), html, 'utf-8')
})

// 3. 复制 todomvc.css（如果 tree 或其他页面需要的话，先保留）
// 目前 tree 和 vModel 不需要 css，但保留逻辑以备后续

console.log('Vercel 部署文件已准备完成：dist/')
