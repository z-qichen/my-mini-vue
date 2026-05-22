<template>
  <div class="home-page">
    <header class="home-header">
      <div class="brand">
        <img class="brand-logo" src="../assets/images/logo.png" alt="Logo" />
        <span class="brand-name">启承问卷系统</span>
      </div>
      <div class="avator">
        <el-avatar size="middle" :src="avatarUrl" />
      </div>
    </header>

    <div class="home-shell">
      <aside class="home-rail">
        <div class="rail-item rail-item-active">
          <el-icon><Document /></el-icon>
          <span>问卷</span>
        </div>
      </aside>

      <aside class="home-sidebar">
        <el-button
          class="sidebar-button create-button"
          type="primary"
          :icon="Plus"
          @click="goToEditor"
        >
          新建
        </el-button>
        <el-button class="sidebar-button market-button" :icon="Compass" @click="goToComMarket">
          组件市场
        </el-button>

        <div class="sidebar-menu">
          <div class="sidebar-menu-item sidebar-menu-item-active">
            <el-icon><Document /></el-icon>
            <span>最近修改</span>
          </div>
        </div>
      </aside>

      <main class="home-content">
        <div class="content-header">
          <h1>最近修改</h1>
        </div>

        <div v-if="tableData.length" class="survey-grid">
          <article v-for="survey in tableData" :key="survey.id" class="survey-card">
            <div class="survey-cover">
              <span class="cover-tag">调查</span>
              <span class="cover-pencil"></span>
              <span class="cover-calculator"></span>
              <span class="cover-paper"></span>
              <span class="cover-chat"></span>
              <span class="cover-chart"></span>
            </div>
            <div class="survey-card-body">
              <h2>{{ survey.title }}</h2>
              <div class="survey-meta">
                <span>{{ formatSurveyDate(survey.updateDate) }}</span>
                <span>{{ survey.surveyCount }} 题</span>
              </div>
              <div class="survey-actions">
                <el-button link type="primary" :icon="View" @click="viewSurvey(survey)">
                  查看问卷
                </el-button>
                <el-button link type="primary" :icon="EditPen" @click="editSurvey(survey)">
                  编辑
                </el-button>
                <el-button link type="danger" :icon="Delete" @click="delSurvey(survey)">
                  删除
                </el-button>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <div class="empty-cover">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>暂无问卷</p>
          <el-button type="primary" :icon="Plus" @click="goToEditor">新建问卷</el-button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Compass, Document, View, EditPen, Delete } from '@element-plus/icons-vue'
import avatarUrl from '@/assets/images/avator.png'
// 路由
import { useRouter } from 'vue-router'
const router = useRouter()
// 类型
import type { SurveyDBReturnData } from '@/types'
// indexedDB
import { getSurveys } from '@/db/operation'
import { remove } from '@/utils/dboperate'

const tableData = ref<SurveyDBReturnData[]>([])

function getSurveyData() {
  getSurveys().then((res) => {
    tableData.value = res as SurveyDBReturnData[]
  })
}
getSurveyData()

const goToEditor = () => {
  localStorage.setItem('activeView', 'editor')
  router.push('/editor/survey-type')
}

const goToComMarket = () => {
  localStorage.setItem('activeView', 'materials')
  router.push('/materials')
}

const viewSurvey = (surveyInfo: SurveyDBReturnData) => {
  router.push({
    path: `/preview/${surveyInfo.id}`,
    state: { from: 'home' },
  })
}

const editSurvey = (surveyInfo: SurveyDBReturnData) => {
  router.push(`/editor/${surveyInfo.id}/survey-type`)
}

const delSurvey = (surveyInfo: SurveyDBReturnData) => {
  remove(Number(surveyInfo.id)).then(() => {
    getSurveyData()
  })
}

const formatSurveyDate = (date: number) => {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: #fff;
  color: #1f2329;
}

.home-header {
  height: 70px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e6eb;
  box-sizing: border-box;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-logo {
  width: 42px;
  height: 42px;
  display: block;
  object-fit: contain;
}

.brand-name {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0;
}

.home-shell {
  min-height: calc(100vh - 70px);
  display: grid;
  grid-template-columns: 80px 252px 1fr;
}

.home-rail {
  padding: 10px 8px;
  background-color: #f0f1f3;
  box-sizing: border-box;
}

.rail-item {
  height: 66px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 8px;
  color: #1f2329;
  font-size: 14px;
}

.rail-item .el-icon {
  font-size: 25px;
}

.rail-item-active {
  color: #0f6bff;
  background-color: #dceaff;
}

.home-sidebar {
  padding: 20px 10px;
  border-right: 1px solid #e5e6eb;
  box-sizing: border-box;
}

.sidebar-button {
  width: 100%;
  height: 40px;
  margin: 0 0 10px;
  border-radius: 6px;
  font-size: 16px;
}

.home-sidebar :deep(.el-button + .el-button) {
  margin-left: 0;
}

.create-button {
  background-color: #0f6bff;
  border-color: #0f6bff;
}

.market-button {
  color: #0f6bff;
  border-color: #69b1ff;
  background-color: #fff;
}

.sidebar-menu {
  margin-top: 10px;
}

.sidebar-menu-item {
  height: 40px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 6px;
  color: #1f2329;
  font-size: 16px;
}

.sidebar-menu-item .el-icon {
  font-size: 20px;
}

.sidebar-menu-item-active {
  color: #0f6bff;
  background-color: #edf4ff;
}

.home-content {
  padding: 24px 40px;
  box-sizing: border-box;
}

.content-header {
  height: 54px;
  display: flex;
  align-items: center;
}

.content-header h1 {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 0;
}

.survey-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(276px, 276px));
  gap: 24px;
  align-items: start;
}

.survey-card {
  width: 276px;
  overflow: hidden;
  border: 1px solid #e5e6eb;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(31, 35, 41, 0.08);
}

.survey-cover {
  height: 148px;
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.45) 1px, transparent 1px) 0 0 / 38px 38px,
    linear-gradient(180deg, rgba(255, 255, 255, 0.45) 1px, transparent 1px) 0 0 / 38px 38px,
    #b9e2ff;
}

.cover-tag {
  position: absolute;
  left: 8px;
  top: 10px;
  padding: 2px 6px;
  border: 1px solid #0f6bff;
  border-radius: 3px;
  color: #0f6bff;
  background-color: #eaf3ff;
  font-size: 14px;
}

.cover-pencil {
  width: 16px;
  height: 70px;
  position: absolute;
  left: 18px;
  top: 30px;
  border-radius: 2px;
  background: repeating-linear-gradient(90deg, #0f6bff 0, #0f6bff 5px, #eef7ff 5px, #eef7ff 9px);
}

.cover-calculator {
  width: 42px;
  height: 58px;
  position: absolute;
  left: 50px;
  top: 28px;
  border-radius: 4px;
  background-color: #77bff1;
}

.cover-calculator::before {
  content: '';
  width: 28px;
  height: 8px;
  position: absolute;
  left: 7px;
  top: 8px;
  border-radius: 2px;
  background-color: #195f9f;
}

.cover-calculator::after {
  content: '';
  width: 5px;
  height: 5px;
  position: absolute;
  left: 9px;
  top: 25px;
  border-radius: 50%;
  background-color: #eaf7ff;
  box-shadow:
    10px 0 #eaf7ff,
    20px 0 #eaf7ff,
    0 10px #eaf7ff,
    10px 10px #eaf7ff,
    20px 10px #eaf7ff,
    0 20px #eaf7ff,
    10px 20px #eaf7ff,
    20px 20px #eaf7ff;
}

.cover-paper {
  width: 62px;
  height: 78px;
  position: absolute;
  left: 106px;
  top: 56px;
  border: 5px solid #ffad25;
  border-radius: 2px;
  background:
    linear-gradient(#dfe5ec, #dfe5ec) 12px 16px / 38px 3px no-repeat,
    linear-gradient(#dfe5ec, #dfe5ec) 12px 28px / 38px 3px no-repeat,
    linear-gradient(#dfe5ec, #dfe5ec) 12px 40px / 38px 3px no-repeat,
    #fff;
}

.cover-paper::before {
  content: '';
  width: 42px;
  height: 8px;
  position: absolute;
  left: 5px;
  top: -14px;
  border-radius: 2px;
  background-color: #145e9f;
}

.cover-chat {
  width: 28px;
  height: 26px;
  position: absolute;
  right: 62px;
  top: 54px;
  border-radius: 4px;
  background-color: #0f6bff;
}

.cover-chat::after {
  content: '';
  position: absolute;
  right: 4px;
  bottom: -6px;
  border-top: 8px solid #0f6bff;
  border-left: 8px solid transparent;
}

.cover-chart {
  width: 0;
  height: 0;
  position: absolute;
  right: 12px;
  top: 42px;
  border-left: 22px solid transparent;
  border-right: 22px solid transparent;
  border-bottom: 42px solid #1478ef;
}

.survey-card-body {
  padding: 18px 20px 14px;
}

.survey-card-body h2 {
  min-height: 28px;
  margin: 0 0 16px;
  overflow: hidden;
  color: #000;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: 0;
}

.survey-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8a9099;
  font-size: 14px;
}

.survey-meta::before {
  content: '';
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  border-radius: 50%;
  background-color: #e6e8eb;
}

.survey-actions {
  min-height: 28px;
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.survey-actions :deep(.el-button) {
  margin-left: 0;
  padding: 0;
}

.empty-state {
  width: 280px;
  min-height: 230px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8a9099;
}

.empty-cover {
  width: 120px;
  height: 90px;
  position: relative;
  margin-bottom: 12px;
  border-radius: 8px;
  background-color: #edf4ff;
}

.empty-cover span {
  width: 74px;
  height: 8px;
  position: absolute;
  left: 23px;
  border-radius: 4px;
  background-color: #b7d3ff;
}

.empty-cover span:nth-child(1) {
  top: 24px;
}

.empty-cover span:nth-child(2) {
  top: 42px;
}

.empty-cover span:nth-child(3) {
  top: 60px;
}

.empty-state p {
  margin: 0 0 16px;
  font-size: 16px;
}

@media (max-width: 768px) {
  .home-header {
    height: 62px;
    padding: 0 16px;
  }

  .brand-logo {
    width: 34px;
    height: 34px;
  }

  .brand-name {
    font-size: 22px;
  }

  .home-shell {
    grid-template-columns: 1fr;
  }

  .home-rail {
    display: none;
  }

  .home-sidebar {
    width: 100%;
    min-height: auto;
    padding: 12px 16px;
    display: flex;
    gap: 12px;
    border-right: none;
    border-bottom: 1px solid #e5e6eb;
  }

  .sidebar-button {
    flex: 1;
    margin-bottom: 0;
  }

  .sidebar-menu {
    display: none;
  }

  .home-content {
    padding: 20px 16px;
  }

  .survey-grid {
    grid-template-columns: 1fr;
  }

  .survey-card {
    width: 100%;
  }
}
</style>
