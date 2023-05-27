<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount, watch} from 'vue';
import HttpServices from "@/services";
import type {HeroesResponseModel, ResponseDTO} from "@/types";
import {Star} from "@element-plus/icons-vue";
import LoadingComponent from "@/components/LoadingComponent.vue";
import {useDark} from '@vueuse/core'
import LogoComponent from "@/components/LogoComponent.vue";


const _httpServices = new HttpServices()
const heroes = ref<HeroesResponseModel[]>([])
const favoriteLoading = ref(false)
const loadingId = ref<string | null>(String())
const currentPage = ref(1)
const pageSize = ref(49)
const total = ref(Number())
const fullscreenLoading = ref(true)
const mainLoading = ref(true)

onMounted(() => {
  updateVisibleHeroes()
  window.addEventListener("resize", updateVisibleHeroes)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateVisibleHeroes)
})

useDark({
  initialValue: 'dark',
})

function updateVisibleHeroes() {
  const screenWidth = window.innerWidth
  const sizeMappings = {
    2252: 56,
    1936: 54,
    1620: 50,
    1300: 48,
    988: 39,
    768: 38,
  }

  let newSize = 20;
  for (const [size, pageSizeValue] of Object.entries(sizeMappings)) {
    if (screenWidth >= Number(size)) {
      newSize = pageSizeValue;
    } else {
      break
    }
  }

  if (pageSize.value !== newSize) {
    pageSize.value = newSize;
    onSubmitList()
  }
}

function onSubmitList() {
  fullscreenLoading.value = true
  _httpServices.list<ResponseDTO<HeroesResponseModel>>(
    `/heroes?current_page=${currentPage.value}&per_page=${pageSize.value}`)
    .then(res => {
      heroes.value = res.data.model.data
      total.value = res.data.model.total
      pageSize.value = res.data.model.per_page
      fullscreenLoading.value = false
      mainLoading.value = false
      gotoTop()
    })
}

function onSubmitFavorite(id: string) {
  favoriteLoading.value = true
  loadingId.value = id
  _httpServices.create(`/heroes?id=${id}`)
    .then(() => {
      _httpServices.list<ResponseDTO<HeroesResponseModel>>(
        `/heroes?current_page=${currentPage.value}&per_page=${pageSize.value}`)
        .then(res => {
          heroes.value = res.data.model.data
          total.value = res.data.model.total
          pageSize.value = res.data.model.per_page
          favoriteLoading.value = false
          loadingId.value = null
        })
    })
}

function handleSizeChange(val: number) {
  pageSize.value = val
  currentPage.value = 1
  onSubmitList()
}

function handleCurrentChange(val: number) {
  currentPage.value = val
  onSubmitList()
}

function gotoTop() {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
}

watch(heroes, updateVisibleHeroes)
</script>

<template>
  <LoadingComponent :loading="mainLoading"/>
  <el-container>
    <el-header v-if="heroes.length > 0">
      <div class="toolbar">
        <LogoComponent/>
      </div>
    </el-header>
    <el-main class="main-container">
      <el-space
        wrap
        style="justify-content: center"
        alignment="center"
        direction="horizontal"
        size="large">
        <el-row :gutter="16" justify="center">
          <div v-for="hero in heroes" :key="hero.id">
            <el-col style="padding-bottom: 16px">
              <el-card :body-style="{padding: 0}" class="card-content">
                <div class="image-wrapper">
                  <div class="image-container">
                    <div class="image-crop">
                      <el-image
                        :src="hero.thumbnail"
                        :fit="'fill'"
                        class="image"
                        alt="hero-image"
                        crossorigin="anonymous"
                      />
                    </div>
                  </div>
                </div>
                <div :style="{padding: '14px'}">
                  <el-text tag="b" truncated>{{ hero.name }}</el-text>
                  <div class="text-description-container">
                    <text class="text-content" type="info">
                      {{
                        hero.description.length !== 0 ?
                          hero.description :
                          'There is no description for this hero on marvel services, sorry to disappoint you.'
                      }}
                    </text>
                  </div>
                </div>
                <div class="delete-button">
                  <el-button
                    @click="onSubmitFavorite(hero.id)"
                    :loading="loadingId === hero.id && favoriteLoading"
                    :disabled="favoriteLoading"
                    :icon="Star"
                    circle/>
                  <el-text style="margin-left: 10px">{{ hero.votes }}</el-text>
                </div>
              </el-card>
            </el-col>
          </div>
        </el-row>
      </el-space>
      <div v-if="total" class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          v-loading.fullscreen.lock="fullscreenLoading"
          :disabled="favoriteLoading"
          background
          layout="prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 70px;
  margin-bottom: 70px;
}

.pagination-container {
  display: flex;
  align-items: center;
  margin-top: 60px;
  margin-bottom: 60px;
  justify-content: center;
}

.text-description-container {
  margin-top: 8px;
  line-height: 12px;
  height: 70px;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.text-content {
  font-size: 12px;
  color: #999;
  position: absolute;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
  max-height: calc(1.5 * 4 * 14px);
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-content {
  width: 300px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.image-wrapper {
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-crop {
  max-width: 100%;
  max-height: 100%;
}

.image {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.delete-button {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  padding: 10px;
  height: 100%;
}

.toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  right: 20px;
}
</style>
