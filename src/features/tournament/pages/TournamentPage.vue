<script setup lang="ts">
import { useI18n } from '@/shared/i18n/useI18n'
import PageHeader from '@/shared/components/PageHeader.vue'
import SkeletonCard from '@/shared/components/SkeletonCard.vue'

const { t } = useI18n()
</script>

<template>
  <div>
    <PageHeader :title="t('menu_tournament')" :subtitle="t('page_coming_soon')" />

    <div class="row g-3">
      <div class="col-12">
        <SkeletonCard :title="t('tournament_section_bracket')" :lines="6" />
      </div>
      <div class="col-md-6">
        <SkeletonCard :title="t('tournament_section_stats')" :lines="4" />
      </div>
      <div class="col-md-6">
        <SkeletonCard :title="t('tournament_section_champion')" :lines="2" />
      </div>
    </div>
  </div>
</template>
