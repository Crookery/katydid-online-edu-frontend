<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="过滤 关键字" style="margin-bottom:30px;" />

    <el-tree
      ref="tree"
      :data="data"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />

  </div>
</template>

<script>
import subjectAPI from '@/api/edu/subject.js'
export default {
  data() {
    return {
      filterText: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created(){
      this.getTreeData()
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    //得到所有分类集合
    getTreeData(){
        subjectAPI.getAllTreeSubject().then(response=>{
            this.data = response.data.tree
        })
    }
  }
}
</script>

