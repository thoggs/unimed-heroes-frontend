<script setup lang="ts">
import {ref, onMounted} from 'vue';
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
const pageSize = ref(50)
const total = ref(Number())
const fullscreenLoading = ref(true)
const mainLoading = ref(true)

onMounted(() => {
  onSubmitList()
})

useDark({
  initialValue: 'dark',
})

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
        <div v-for="hero in heroes" :key="hero.id">
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
                <text class="text-content" type="info">{{ hero.description }}</text>
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
        </div>
      </el-space>
      <div v-if="total" class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          v-loading.fullscreen.lock="fullscreenLoading"
          :page-sizes="[20, 30, 50, 100]"
          :disabled="favoriteLoading"
          background
          layout="sizes, prev, pager, next"
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
