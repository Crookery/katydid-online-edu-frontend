<template>
  <div>
    <link
      rel="stylesheet"
      href="https://g.alicdn.com/de/prismplayer/2.8.1/skins/default/aliplayer-min.css"
    />
    <script
      charset="utf-8"
      type="text/javascript"
      src="https://g.alicdn.com/de/prismplayer/2.8.1/aliplayer-min.js"
    ></script>
    <div class="prism-player" id="J_prismPlayer"></div>
  </div>
</template>

<script>
import vodAPI from "@/api/vod";

export default {
  layout: "video",
  asyncData({ params, error }) {
    return vodAPI.getPlayAuth(params.id).then((response) => {
      return {
        playAuth: response.data.data.playAuth,
        vid: params.id,
      };
    });
  },
  //数据渲染之后
  mounted() {
    console.log(this.playAuth);
    var player = new Aliplayer(
      {
        id: "J_prismPlayer",
        vid: this.vid, // 视频id
        playauth: this.playAuth, // 播放凭证
        width: "100%",
        height: "500px",
        //播放配置
        autoplay:false
      },
      function (player) {
        console.log("播放器创建好了。");
      }
    );
  }
};
</script>