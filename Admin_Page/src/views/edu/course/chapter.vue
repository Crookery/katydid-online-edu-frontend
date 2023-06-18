<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>

    <el-button type="text" @click="dialogChapterVisible = true"
      >添加章节</el-button
    >

    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in chapterList" :key="chapter.id">
        <p>
          {{ chapter.name }}

          <span class="acts">
            <el-button style="" type="text" @click="openVideo(chapter.id)"
              >添加小节</el-button
            >
            <el-button style="" type="text" @click="openEditChatper(chapter.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="removeChapter(chapter.id)"
              >删除</el-button
            >
          </span>
        </p>
        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.name }}
              <span class="acts">
                <!-- TODO：编辑小节 -->
                <el-button style="" type="text" @click="editVideo(video.id)"
                  >编辑</el-button
                >
                <el-button type="text" @click="delVideo(video.id)"
                  >删除</el-button
                >
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next"
        >下一步</el-button
      >
    </div>

    <!-- （显示属性dialogChapterVisible）模态框：添加和修改章节表单 -->
    <el-dialog
      :visible.sync="dialogChapterVisible"
      :before-close="handleClose"
      title="添加章节"
    >
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model="chapter.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearData">清 空</el-button>
        <el-button @click="dialogChapterConcle">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 小节模态框 -->
    <el-dialog
      :visible.sync="dialogVideoVisible"
      :before-close="handleClose2"
      title="添加课时"
    >
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number
            v-model="video.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上传视频">
          <el-upload
            class="upload-demo"
            :action="BASE_API + '/eduVod/video/upload'"
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            multiple
            :limit="1"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，<br />
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br />
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br />
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br />
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          :disabled="saveVideoBtnDisabled"
          type="primary"
          @click="saveOrUpdateVideo"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapterAPI from "@/api/edu/chapter.js";
import videoAPI from "@/api/edu/video.js";

export default {
  data() {
    return {
      courseID: "", //路径中的课程ID

      saveVideoBtnDisabled: false, //小节模态框确认按钮
      saveBtnDisabled: false, //章节模态框确认按钮
      dialogChapterVisible: false, //章节模态框是否可见
      dialogVideoVisible: false, //章节模态框是否可见

      chapterList: [], //章节和小节Tree信息(含id)

      chapter: {
        //用于添加和修改章节信息
        title: "",
        sort: 0,
        courseId: "", //隶属课程ID，方便提交，故重复输入
      },

      video: {
        //小节信息
        title: "",
        sort: 0,
        isFree: 0, //是否可试听 (1可听)
        videoSourceId: "",
        videoOriginalName: "",
      },

      fileList: [], //上传文件列表
      BASE_API: process.env.BASE_API, //接口API地址
    };
  },
  created() {
    //获取路由中ID值
    if (this.$route.params && this.$route.params.id) {
      this.courseID = this.$route.params.id;
      this.chapter.courseId = this.$route.params.id;
      this.getChapterVideo(this.courseID);
    }
  },
  methods: {
    //=================================公共方法========================================
    //1.上一步
    previous() {
      this.$router.push({ path: "/course/info/" + this.courseID });
    },
    //2.下一步
    next() {
      this.$router.push({ path: "/course/publish/" + this.courseID });
    },
    //3.获取所有章节和小节的信息
    getChapterVideo(courseID) {
      chapterAPI.getChapterVideo(courseID).then((response) => {
        this.chapterList = response.data.treeChapter;
      });
    },
    //=================================视频模块========================================
    //上传成功
    handleVodUploadSuccess(response, file, fileList) {
      this.video.videoSourceId = response.data.videoID;
      this.video.videoOriginalName = file.name;
      this.fileList = fileList;
    },
    //超出限定数量
    handleUploadExceed() {
      this.$message.warning("已超出限定视频数量，限定为1个，请先删除已有文件");
    },
    //响应删除
    handleVodRemove() {
      if (this.video.openClass === 1) {
        //添加框中打开（若不保存，视频需要删除，调用vod的直接删云上视频，不用修改数据库）
        videoAPI.delAliVideo(this.video.videoSourceId).then((response) => {
          if (response.code == 2000) {
            this.$message.success("删除视频成功!");
            this.fileList = [];
            this.video.videoSourceId = "";
            this.video.videoOriginalName = "";
          } else {
            this.$message.error("删除视频失败");
          }
        });
      } else {
        //不管有无，都先删除云上视频
        videoAPI.delAliVideo(this.video.videoSourceId).then((response) => {
            if (response.code == 2000) {
                this.$message.success("删除视频成功!");
                videoAPI.getVideo(this.video.id).then((response) => {
                    let origin = response.data.videoInfo.videoSourceId;
                    if(origin!=''){
                        //更新表
                        this.video.videoSourceId = ''
                        this.videoOriginalName = ''
                        videoAPI.updateVideo(this.video).then((response) => {
                            if (response.code == 2000) {
                                this.$message.success("小节已更新");
                            }
                            this.getChapterVideo(this.courseID);
                        });
                    }
                })
                this.fileList = [];
                this.video.videoSourceId = "";
                this.video.videoOriginalName = "";
            } else {
                this.$message.error("删除视频失败");
            }
        })   
      }  
    },
    //响应删除前
    beforeVodRemove(file, fileList) {
      return this.$confirm(`是否删除${file.name}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
    },
    //=================================小节内容========================================
    //1.添加小节按钮功能
    openVideo(chapterId) {
      this.dialogVideoVisible = true;
      //每次打开，都进行设置id
      this.setChapterIDandCourseID(chapterId);
    },
    //表示从“章节—添加小节”中打开
    setChapterIDandCourseID(chapterId) {
      this.video.openClass = 1; //打开位置标识(1表示从章节打开-添加小节)
      this.video.chapterId = chapterId;
      this.video.courseId = this.courseID;
    },
    //2.2 清除数据
    clearVideoData() {
      this.video.chapterId = "";
      this.video.courseId = "";
      this.video = {
        title: "",
        sort: 0,
        isFree: 0,
        videoSourceId: "",
        videoOriginalName: "",
      };
      this.fileList = [];
    },
    //2.3 模态框“x”和点击空白关闭
    handleVideoClose(done) {
      this.$confirm("是否关闭").then((_) => {
        done();
        this.clearVideoData();
      });
    },
    //3.模态框保存按钮
    saveOrUpdateVideo() {
      if (this.video.openClass && this.video.openClass == 1) {
        this.saveVideo();
      } else {
        this.updateVideo();
      }
    },
    saveVideo() {
      if (this.video.title == "") {
        this.$message.error("标题不能为空");
      } else {
        this.video.isFree = this.video.isFree ? 1 : 0;
        videoAPI.addVideo(this.video).then((response) => {
          if (response.code == 2000) {
            this.$message.success("添加成功");
          }
          this.dialogVideoVisible = false;
          this.clearVideoData();
          this.getChapterVideo(this.courseID);
        });
      }
    },
    updateVideo() {
      if (this.video.title == "") {
        this.$message.error("标题不能为空");
        return;
      } else {
        this.video.isFree = this.video.isFree ? 1 : 0;
        videoAPI.updateVideo(this.video).then((response) => {
          if (response.code == 2000) {
            this.$message.success("小节已保存");
          }
          this.dialogVideoVisible = false;
          this.clearVideoData();
          this.getChapterVideo(this.courseID);
        });
      }
    },
    //4.删除小节
    delVideo(videoId) {
      this.$confirm("是否删除该小节?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //确定删除
        videoAPI.delVideo(videoId).then((response) => {
          if (response.code == 2000) {
            this.$message.success("小节删除成功");
          }
          this.getChapterVideo(this.courseID);
        });
      });
    },
    //5.编辑小节
    editVideo(videoId) {
      this.video.openClass = 0;
      videoAPI.getVideo(videoId).then((response) => {
        this.video = response.data.videoInfo;
        if (
          this.video.videoOriginalName &&
          this.video.videoOriginalName != ""
        ) {
          this.fileList = [{ name: this.video.videoOriginalName }];
        }
        this.dialogVideoVisible = true;
      });
    },

    //小节—非按钮关闭模态框，清空数据
    handleClose2(done) {
      if (this.video.openClass && this.video.openClass == 1) {
        //添加小节
        if (this.fileList.length != 0) {
          this.$message.info("请先删除视频，再关闭添加页面");
        } else {
          this.clearVideoData();
          done();
        }
      } else {
        //编辑小节
        this.$confirm("确定关闭?")
          .then((_) => {
            this.clearVideoData();
            done();
          })
          .catch((_) => {
            //do nothing
          });
      }
    },
    //=================================章节内容========================================
    //1.关闭模态框,清空双向绑定的数据
    dialogChapterConcle() {
      this.dialogChapterVisible = false;
      this.clearData();
    },
    //2.模态框清空数据按钮
    clearData() {
      this.chapter.title = "";
      this.chapter.sort = 0;
    },
    //3.(增改)模态框确定按钮
    saveOrUpdate() {
      //看章节id是否为空，是则修改
      this.chapter.id ? this.update(this.chapter.id) : this.save();
    },
    //(增)
    save() {
      if (this.chapter.title != "") {
        chapterAPI.addChapter(this.chapter).then((response) => {
          if (response.code === 2000) {
            this.$message.success("添加章节成功!");
          }
          this.dialogChapterVisible = false;
          this.getChapterVideo(this.courseID);
          this.clearData();
        });
      } else {
        this.$message.error("章节名称不能为空!");
      }
    },
    //(改) id是章节id
    update(id) {
      if (this.chapter.title != "") {
        chapterAPI.updateChapter(id, this.chapter).then((response) => {
          if (response.code === 2000) {
            this.$message.success("修改章节成功!");
          }
          this.dialogChapterVisible = false;
          this.getChapterVideo(this.courseID);
          this.clearData();
        });
      } else {
        this.$message.error("章节名称不能为空!");
      }
    },
    //4.修改按钮（获取数据，其他功能交给模态框,id是章节id）
    openEditChatper(id) {
      chapterAPI.getChapter(id).then((response) => {
        this.chapter = response.data.chapter;
        this.dialogChapterVisible = true;
      });
    },
    //5.(删，包含本章和其下所有小节,id是章节id)
    removeChapter(id) {
      this.$confirm("是否删除该章节及该章节下所有小节?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //确定删除
          chapterAPI.delChapter(id).then((response) => {
            if (response.code == 2000) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
            this.getChapterVideo(this.courseID);
          });
        })
        .catch(() => {
          //取消
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //章节—非按钮关闭模态框，清空数据
    handleClose(done) {
      this.$confirm("是否关闭").then((_) => {
        done();
        this.clearData();
      });
    },
  },
};
</script>

<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>