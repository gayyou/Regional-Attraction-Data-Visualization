import { pathUtil } from './staticObjctUtils'
import { getGeoJSON } from './model'

/**
 * @description 得到飞线的path路径
 * @param { item: Object } item 路径，包括权值以及两点间的经纬度
 */
export function getFlyLine(item) {
  console.log(getGeoJSON(item))
  return pathUtil()(getGeoJSON(item));
}

// export function renderPath(item, target) {
//   let d3 = window.d3,
//     svg = d3.select(target)//定位页面位置
//         .append('svg')//添加画布
//         .attr('width', '100vw')//添加宽度
//         .attr('height', '100vh');
//   let path = getFlyLine(item);

//   console.log(svg.append('path')
//     .attr('d', path)
//     .attr('stroke', 'blue')
//     .attr('stroke-width', 2)
//     .attr('fill', 'none'));

//   return svg;
// }

export function createOverlayHandle (item, that) { // 创建自定义叠加层
  const _self = that;
  let d3 = window.d3;

  USGSOverlay.prototype = new window.google.maps.OverlayView() // 继承overlayView
  function USGSOverlay () { // 存放需要放的属性
    this.setMap(_self.map);
    this.layer = null;
  }
  USGSOverlay.prototype.onAdd = function () { // 添加的方法：控制渲染成自定义的模板
    let panes = this.getPanes()
    console.log(panes)
    this.layer = d3.select(panes.overlayLayer);
    this.layer.append('svg').attr('width', '100vw')//添加宽度
              .attr('height', '100vh').append('path')
    // this.layer.append('svg')
    //           // .attr('class', 'stations')
    //           // .attr('width', '100vw')//添加宽度
    //           // .attr('height', '100vh')
    //           .append('path')
    //           .attr('d', getFlyLine(item))
    //           .attr('stroke', 'blue')
    //           .attr('stroke-width', 2)
    //           .attr('fill', 'none');
  }
  USGSOverlay.prototype.draw = function () { 
    let projection = this.getProjection();
    let d1 = new window.google.maps.LatLng(item.cor[0][1], item.cor[0][0]);
    console.log('d1', d1.lng());
    d1 = projection.fromLatLngToDivPixel(d1);
    let d2 = new window.google.maps.LatLng(item.cor[1][1], item.cor[1][0]);
    d2 = projection.fromLatLngToDivPixel(d2);
    item.cor[0] = [d1.x, d1.y];
    item.cor[1] = [d2.x, d2.y];
    console.log(item)
    this.layer.select('path')
              .attr('d', getFlyLine(item))
              .attr('stroke', 'blue')
              .attr('stroke-width', 2)
              .attr('fill', 'none');
  }
  USGSOverlay.prototype.onRemove = function () { // 方法：删除
    
  }
  let overlay = new USGSOverlay() // 创建实例化对象
  console.log(overlay)
  // overlay.draw();
  // overlay.onAdd();
}