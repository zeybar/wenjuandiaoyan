<template>
  <dl class="wenjuan-item">
    <dt>1.{{ data.title }}</dt>
    <dd>
      <el-checkbox-group v-model="checkList">
        <el-checkbox label="复选框 A"></el-checkbox>
        <el-checkbox label="复选框 B"></el-checkbox>
        <el-checkbox label="复选框 C"></el-checkbox>
        <el-checkbox label="禁用" disabled></el-checkbox>
        <el-checkbox label="选中且禁用" disabled></el-checkbox>
      </el-checkbox-group>
    </dd>
  </dl>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'single',
      validator: (val) => ['single', 'muti', 'answer'].includes(val),
    },
    data: {
      type: Object,
      default: () => ({}),
    }
  }
}
</script>

<style lang="scss" scoped>

</style>