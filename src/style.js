const style =  `
<style>
html, body{
  margin: 0;
  width: 100%;
  height: 100%;
}
.video{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 24px 15px;
  color: #222222;
}
.title{
  display: flex;
  justify-content: space-between;
  line-height: 28px;
}
.left-title1,.left-title2,.left-title3,.left-title4{
  position: relative;
  margin-left: 18px;
}
.left-title1::before{
  content: '';
  width: 6px;
  height: 64px;
  position: absolute;
  left: -18px;
  background: #222222;
  opacity: 0.3;
  border-radius: 3px;
}
.left-title2::before{
  content: '';
  width: 6px;
  height: 64px;
  position: absolute;
  left: -18px;
  background: #ffffff;
  opacity: 0.3;
  border-radius: 3px;
}
.left-title3::before{
  content: '';
  width: 6px;
  height: 55px;
  position: absolute;
  left: -18px;
  background: #222222;
  opacity: 0.3;
  border-radius: 3px;
}
.left-title4::before{
  content: '';
  width: 6px;
  height: 55px;
  position: absolute;
  left: -18px;
  background: #ffffff;
  opacity: 0.3;
  border-radius: 3px;
}
.title1{
  height: 31px;
  font-size: 24px;
  font-weight: bold;
}
.title2{
  height: 21px;
  margin-top: 10px;
  font-size: 16px;
}
.source{
  font-size: 16px;
}
.half{
  height: 21px;
  margin-top: 24px;
  font-size: 16px;
}
#chart{
  height: calc(100% - 107px);
}
.domain{ 
  display: none;
}
.rect{
  transform: translate(70px, -6px);
}
.rect1{
  transform: translate(70px, 0px);
}
</style>
<div class="video">
  <div class="title">
    <div id="title" class="left-title1 ">
      <div id="title1" class="title1 text">主标题</div>
      <div id="title2" class="title2 text">副标题</div>
    </div>
    <div id="source" class="source text">数据来源：某某网</div>
  </div>
  <div  id="half" class="half text">单位：分</div>
  <div id="chart"></div>
</div>`

module.exports = style