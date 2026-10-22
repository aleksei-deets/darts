<script setup lang="ts">
import { useI18n } from '@/shared/i18n/useI18n'
import PageHeader from '@/shared/components/PageHeader.vue'
import SkeletonCard from '@/shared/components/SkeletonCard.vue'

const { t } = useI18n()
</script>

<template>
  <div>
    <PageHeader :title="t('menu_statistics')" :subtitle="t('page_coming_soon')" />

    <div class="row g-3">
      <div class="col-md-6">
        <SkeletonCard :title="t('statistics_section_matches')" :lines="5" />
      </div>
      <div class="col-md-6">
        <SkeletonCard :title="t('statistics_section_overall')" :lines="5" />
      </div>
      <div class="col-12">
        <SkeletonCard :title="t('statistics_section_rating')" :lines="4" />
      </div>
    </div>
  </div>
</template>
