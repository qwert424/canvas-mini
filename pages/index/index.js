// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    ctx: "",//canvas上下文
    ishidden: true,
    CanvasWidth: 6,
    strokeStyle: "#000000"
  },
  startX: "",
  startY: "",
  onReady() {
    const query = wx.createSelectorQuery();
    query.select('#myCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        // 显示设置canvas宽高
        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)
        this.setData({
          ctx
        })
      })
  },
  // 事件处理函数
  handleTouchStart(e) {
    // 获取点击的初始坐标
    this.startX = e.changedTouches[0].clientX;
    this.startY = e.changedTouches[0].clientY;
    this.data.ctx.strokeStyle = this.data.strokeStyle;
    this.data.ctx.lineWidth = this.data.CanvasWidth;
    this.data.ctx.lineCap = "round";
    // 开始画画
    this.data.ctx.beginPath();
  },
  handleTouchMove(e) {
    const startX = e.changedTouches[0].clientX;
    const startY = e.changedTouches[0].clientY;
    const ctx = this.data.ctx;
    ctx.moveTo(this.startX, this.startY)
    ctx.lineTo(startX, startY);
    ctx.stroke();
    this.startX = startX;
    this.startY = startY;
  },
  handleTouchEnd() {
    this.data.ctx.closePath();
  },
  handleLongTap() {
    wx.showModal({
      title: '确定清空',
      content: '是否清空画布',
      complete: (res) => {
        if (res.cancel) {
          wx.showToast({
            title: '取消操作',
            icon: 'error'
          })
        }
        if (res.confirm) {
          this.data.ctx.clearRect(0, 0, this.data.ctx.canvas.width, this.data.ctx.canvas.height)
          wx.showToast({
            title: '清空成功',
            icon: 'success'
          })
        }
      }
    })
  },
  handleChange(e) {
    this.setData({
      CanvasWidth: e.detail.value
    })
  },
  // 选择粗细
  penSelect() {
    if (this.data.strokeStyle === '#bbb'&&this.data.oldCanvasWidth!==this.data.CanvasWidth) {
      this.setData({
        strokeStyle: '#000',
        ishidden: !this.data.ishidden,
        CanvasWidth:this.data.oldCanvasWidth
      })
    } else {
      this.setData({
        ishidden: !this.data.ishidden
      })
    }
  },
  // 选择颜色
  colorSelect(e) {
    if(this.data.strokeStyle === '#bbb'&&this.data.oldCanvasWidth!==this.data.CanvasWidth){
      this.setData({
        strokeStyle: e.currentTarget.dataset.param,
        ishidden:true,
        CanvasWidth:this.data.oldCanvasWidth
      })
    }else{
      this.setData({
        strokeStyle: e.currentTarget.dataset.param,
        ishidden:true
      })
    }
  },
  // 橡皮檫
  clearCanvas() {
    const oldCanvasWidth=this.data.CanvasWidth;
    this.setData({
      strokeStyle: '#bbb',
      CanvasWidth: 20,
      oldCanvasWidth,
      ishidden:true
    })
  },
  onShareAppMessage(){
    return{
      title:"简易版涂鸦画板",
      imageUrl:"/assets/微信图片_20231017001227.png"
    }
  }
})
