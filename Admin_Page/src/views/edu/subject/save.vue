<template>
    <div class="app-container">
    <!-- 此处为 -->
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="this.BASE_OSS+'/subjectModel.xlsx'">点击下载模版</a>
        </el-tag>

      </el-form-item>

      <el-form-item label="选择Excel">
        <!--
          accept设置上传文件类型
          name需要与后端控制器的参数名一致
        -->
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"    
          :action="BASE_API+'/edu/subject/addSubject'"
          name="file"
          accept="application/vnd.ms-excel">    
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">上传到服务器</el-button>
            <!-- 这里的提交，只是普通表单提交 -->
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    data(){
        return{
            BASE_API: process.env.BASE_API, // 接口API地址
            BASE_OSS:process.env.BASE_OSS,
            importBtnDisabled: false, // 按钮是否禁用,
            loading: false
        }
    },
    created(){

    },
    methods:{
        //上传成功
        fileUploadSuccess(){
          this.loading=false;
          this.$message({
            type:'success',
            message:'添加课程成功'
          })
        },
        //上传失败
        fileUploadError(){
          this.loading=false;
          this.importBtnDisabled=false;
          this.$message({
              type:'error',
              message:'上传失败'
            })
        },
        //提交上传
        submitUpload(){
          let fileNum = this.$refs.upload.uploadFiles.length
          if(fileNum == 1){
            this.loading = true;
            this.importBtnDisabled =true;
            this.$refs.upload.submit();   //相当于document.getElemetnById("upload").submit();
          }else if(fileNum > 1){
            this.$message({
              type:'info',
              message:'提交文件数过多'
            })
          }else{
            this.$message({
              type:'error',
              message:'提交文件数不能为空'
            })
          }
        }

    }
}
</script>