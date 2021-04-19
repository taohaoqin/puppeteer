var dataOri = []
var flagList = []
var colorObj =  {}
var proportion = "16:9"
var num = 0
var duration = ''
var list = []
var stopTime = 200

  var width = 1850, 
      height = 900,
      margin = {top: 0, bottom:0 , left: 50, right:  200 },
      dataList = [],
      count = 10,
      barPadding = 60,
      transitionTime = 0,
      second = 16

var chartWidth = width - (margin.left + margin.right), chartHeight = height - (margin.top + margin.bottom)
var dateIndex = 1,
    
    chart = null, 
    scale = null, 
    axis = null, 
    svg = null, 
    dateTitle = null,
    bars = null,
    state = false
var dataSlice = []
var barHeight = (chartHeight - (barPadding * count)) / count

function getDate () { return  dataOri[0][dateIndex] }
function lastDate () { return dataOri[0][dataOri[0].length - 1]}
var date = getDate()

function createSvg (){
  svg = d3.select('#chart').append('svg').attr('width', width).attr('height', height)
}
function formatData ()  {
  dataOri[0].forEach((i, k) => {
      if (k > 0) {
        dataOri.forEach((item, key) => {
          if (key > 0) {
            dataList.push({
              name: item[0],
              value: Number(item[k]),
              lastValue: k > 1 ? Number(item[k - 1]) : 0,
              date: i,
              color: colorObj.series4,
              img: flagList[key - 1] ? flagList[key - 1] : ''
            })
          }
        })
      }
  })
}
function changeColor(i, k){ //根据排名选颜色
  if(i < 3) {
    return colorObj['series' + (k + 1)]
  } else {
    return i.color
  }
}
// 获取当天数据并按倒叙排列
function sliceData  () {
  // console.log(date, num)
  // dataSlice = dataList.filter(d => d.date === date && d.number === num).sort((a, b) => b.value - a.value).slice(0, count);
  dataSlice = dataList.filter(d => d.date === date).sort((a, b) => b.value - a.value).slice(0, count);
  dataSlice.forEach((i, k) => {
    if( k < 3){
      i.color = colorObj['series' + (k + 1)]
    } else {
      i.color = colorObj.series4
    }
  })
  // console.log(dataSlice)
}
// 创建比例尺
function createScale  () {
  scale = d3.scaleLinear().domain([0, d3.max(dataSlice, d => d.value)]).range([0, chartWidth]);
}
  

// 创建坐标轴
function renderAxis  () {
  createScale()
  axis = d3.axisTop().scale(scale).ticks(5).tickPadding(10).tickSize(0);
  svg.append('g')
    .classed('axis', true)
    .style('transform','translate3d('+ margin.left+ 'px, '+ margin.top + 'px, 0)')
    .call(axis)
}

function updateAxis  (){
  createScale();
  axis.scale().domain([0, d3.max(dataSlice, d => d.value)]);
  svg.select('g.axis')
    .transition().duration(transitionTime).ease(d3.easeLinear)
    // .call(axis);
  d3.selectAll('g.axis g.tick text').attr('font-size', 14);
}
function renderDateTitle () { //右下角变量
  dateTitle = svg.append('text')
    .classed('date-title', true)
    .text(date)
    .attr('x', proportion === "16:9" ? width : width - 50)
    .attr('y', () => {
      if(proportion === "16:9"){
        return chartHeight - margin.left
      }
        return chartHeight - margin.left + 130
    })
    .attr('fill', colorObj.text)
    .attr('font-size', proportion === "16:9" ? 104 : 55)
    .attr('opacity', 0.3)
    .attr('text-anchor', 'end')
}
function calTranslateY  (i, end) {
  if (dateIndex === 1 || end) {
    return (barHeight + barPadding) * i + (barPadding / 2)
  } else {
    return (barHeight + barPadding) * (count + 1)
  }
}
function createChart() {
  chart = svg.append('g')
    .classed('chart', true)
    .style('transform', 'translate3d('+ margin.left +'px, ' + margin.top +'px, 0)');
}
function createTicker() {
  const ticker = d3.interval(() => {
    // console.log(dateIndex, num, dataOri[0].length - 1)
    if (dateIndex < dataOri[0].length - 1) {
      // dateIndex++
      if(num % 25 === 0 || date === lastDate){
        dateIndex++
      }
      if(num === 25){
        num = 1
      } else {
        num ++
      }
      date = getDate()
      dateTitle.text(date)
      sliceData()
      updateAxis()
      renderChart()
      // nextRender()
    } else {
      ticker.stop()
    }
  }, transitionTime)
}

function renderChart (){ //渲染图表
    bars = chart.selectAll('g.bar').data(dataSlice, (d) => d.name)
    let barsEnter
    barsEnter = bars.enter()
      .append('g')
      .classed('bar', true)
      .style('transform', (d, i) => 'translate3d(0,' + calTranslateY(i) + 'px, 0)')

    dateIndex > 1 && barsEnter
      .transition().duration((transitionTime))
      .style('transform', (d, i) => 'translate3d(0,' + calTranslateY(i, 'end') + 'px, 0)')

    barsEnter.append("svg:image") //添加图片
      .attr("xlink:href", d => d.img)
      .attr("x", -50)
      .attr("y", -7)
      .attr("width", 49)
      .attr("height", 32)

    barsEnter.append('rect') //柱状图
      .classed('rect', () => {
        if(proportion === "16:9"){
          return true
        } else {
          return false
        }
      })
      .classed('rect1', () => {
        if(proportion === "16:9"){
          return false
        } else {
          return true
        }
      })
      .style('width', d => proportion === "16:9" ?  scale(d.value) + 'px': parseInt(scale(d.value))  +'px')
      .style('height', barHeight + 'px')
      .style('fill', (d) =>  d.color )

    barsEnter.append('text') //左侧文字
      .classed('label', true)
      .text(d => d.name)
      .attr('x', 3)
      .attr('y', 14)
      .attr('font-size', 14)
      .style('text-anchor', 'start')
      .style('fill', colorObj.text)

    barsEnter.append('text') //右侧文字
      .classed('value', true)
      .text(d => { return  String(d.value).indexOf('.') > 0 ? d.value.toFixed(form.num): d.value })
      .attr('x', d => proportion === "16:9" ? scale(d.value) + 90:  parseInt(scale(d.value)) + 80) //坐标末端的文字位置
      .attr('y', 18)
      .attr('font-size', proportion === "16:9" ? 24 : 14)
      .attr('font-weight', 'bold')
      .style('fill', (d, i) => changeColor(d, i))

    bars.transition().duration((transitionTime)).ease(d3.easeLinear) //整体位置 颜色等变化
      .style('transform', function (d, i) {
        return 'translate(0, ' + calTranslateY(i, 'end') + 'px)'
      })
      .select('rect')
      .style('width', function (d) {
        return scale(d.value) + 'px'
      })
      .style('fill', (d, i) => changeColor(d, i))
      

    bars.select('text.value')//右侧文字变化
      .transition().duration((transitionTime)).ease(d3.easeLinear)
      .attr('x', function (d) {
        return proportion === "16:9" ? scale(d.value) + 90:  parseInt(scale(d.value)) + 80 //坐标末端的文字位置
      })
      .style('fill', (d, i) => changeColor(d, i))
      .tween('text', function (d) {
        const textDom = this
        const i = interpolateRound(d.lastValue, d.value)
        return (t) => textDom.textContent = i(t)
      })

    bars.exit()
      .transition().duration((transitionTime)).ease(d3.easeLinear)
      .style('transform', function (d, i) {
        return 'translate3d(0, ' + calTranslateY(i) + 'px, 0)'
      })
      .style('width', function (d) {
        return scale(d.value) + 'px'
      })
      .remove()
  }

function init (){
  createSvg() // 创建一个svg
  formatData() // 格式化数据
  sliceData() // 截取当天数据
  renderAxis() // 渲染坐标轴
  renderDateTitle() // 渲染日期
  createChart() // 创建图表
  renderChart() // 渲染图表
  
}
//init()

function $id(id){
  return document.getElementById(id)
}
function $c(c){
  return document.getElementsByClassName(c)
}

function setColor(){
  if(proportion === "9:16"){
    $c('video')[0].style.width = '607px'
    $id('title1').style.fontSize = '16px'
    $id('title2').style.fontSize = '14px'
    $id('source').style.fontSize = '14px'
    $id('half').style.fontSize = '14px'
    if(colorObj.text === '#FFFFFF'){
      $id('title').className = 'left-title4'
    } else {
      $id('title').className = 'left-title3'
    }
    width = 550 
    margin.bottom = 80
    margin.right = 150
  } else {
    $c('video')[0].style.width = '100%'
    if(colorObj.text === '#FFFFFF'){
      $id('title').className = 'left-title2'
    } else {
      $id('title').className = 'left-title1'
    }
    width = 1850
    margin.bottom = 0
    margin.right = 200
  }
  chartWidth = width - (margin.left + margin.right)
  chartHeight = height - (margin.top + margin.bottom)
  barHeight = (chartHeight - (barPadding * count)) / count
  $id('title1').innerText = form.title1
  $id('title2').innerText = form.title2
  $id('source').innerText = form.source
  $id('half').innerText = form.half
  let list = $c('text')
  for(let i = 0; i < list.length; i++ ){
    list[i].style.color = colorObj.text
  }
  $c('video')[0].style.backgroundColor =  colorObj.bg
}

function interpolateRound(a, b) { //复制了d3.interpolateRound 修改了一些格式
  return a = +a, b = +b, (t) => {
    return String(a * (1 - t) + b * t).indexOf('.') > 0 ? (a * (1 - t) + b * t).toFixed(form.num): (a * (1 - t) + b * t);
  }
}

function setData(obj) {
  return new Promise((resolve) => {
    dataOri = obj.dataOri
    setTimeout(()=>{
      resolve(true)
    }, 100)
  })
}
function nextRender(){
  return new Promise((resolve, reject) => {
    if(dateIndex < dataOri[0].length ){
      if(num % parseInt(25 / (1000 / duration)) === 0 || date === lastDate){
        dateIndex++
        date = getDate()
        dateTitle.text(date)
      } 
      if(num === parseInt(25 / (1000 / duration))){
        num = 1
      } else {
        num ++
      }
      console.log(dateIndex, num)
      // if(dateIndex >= dataOri[0].length){
      let maxIndex = (list[1] && list[1] + 1 <= dataOri[0].length) ? list[1] + 1 : dataOri[0].length
      if(dateIndex >= maxIndex){
        reject()
        return false
      }
      date = getDate()
      dateTitle.text(date)
      sliceData()
      updateAxis()
      renderChart()
      resolve(true)
    } else {
      reject()
    }
  })
}