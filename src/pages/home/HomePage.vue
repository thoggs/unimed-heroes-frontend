<script setup lang="ts">
import {ref, onMounted} from 'vue';
import HttpServices from "@/services";
import type {HeroesResponseModel, ResponseDTO} from "@/types";
import {Star} from "@element-plus/icons-vue";


const _httpServices = new HttpServices()
const heroes = ref<HeroesResponseModel[]>([])
const favoriteLoading = ref(false)
const loadingId = ref<string | null>(String())
const currentPage = ref(1)
const pageSize = ref(30)
const total = ref(Number())
const disabled = ref(false)
const fullscreenLoading = ref(true)

onMounted(() => {
  onSubmitList()
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
  console.log(`current page: ${val}`)
  currentPage.value = val
  onSubmitList()
}
</script>

<template>
  <el-container>
    <el-header v-if="heroes.length > 0">
      <el-menu
        default-active="1"
        class="el-menu-demo"
        mode="horizontal">
        <el-menu-item index="1">Marvel Heroes</el-menu-item>
      </el-menu>
    </el-header>
    <el-main class="main-container">
      <div style="display: flex; width: 100%; flex-wrap: wrap; justify-content: center">
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
              <el-text tag="b">{{ hero.name }}</el-text>
              <div class="text-description-container">
                <el-text class="text-content">{{ hero.description }}</el-text>
              </div>
            </div>
            <div @click="onSubmitFavorite(hero.id)" class="delete-button">
              <el-button :loading="loadingId === hero.id && favoriteLoading" :icon="Star" circle/>
              <el-text style="margin-left: 10px">{{ hero.votes }}</el-text>
            </div>
          </el-card>
        </div>
      </div>
      <div v-if="total" class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          v-loading.fullscreen.lock="fullscreenLoading"
          :page-sizes="[20, 30, 50, 100]"
          :disabled="disabled"
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
  padding-top: 50px;
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
}

.text-content {
  font-size: 12px;
  color: #999;
}

.card-content {
  width: 300px;
  margin: 10px;
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
</style>
