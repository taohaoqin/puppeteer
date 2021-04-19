/**
 * 云非编字幕
 * Created by wuchang on 2019/7/9.
 */

 class Param {
  constructor({
    dataOri = [], // 编号
    colorObj = {},
    proportion = '',
    second = 0,
    form = {},
    flagList = [],
    stopTime = 200,
  }) {
    this.dataOri = dataOri
    this.colorObj = colorObj
    this.proportion = proportion
    this.second = second
    this.form = form
    this.flagList = flagList
    this.stopTime = stopTime
  }
}
module.exports = Param