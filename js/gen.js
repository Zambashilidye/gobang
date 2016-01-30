/*
 * 产生待选的节点
 * 这个函数的优化非常重要，这个函数产生的节点数，实际就是搜索总数的底数。比如这里平均产生50个节点，进行4层搜索，则平均搜索节点数为50的4次方（在没有剪枝的情况下）
 * 如果能减少产生的节点数，那么能指数级减少搜索时间
 * 如果能对返回的节点排序，先返回优先级高的节点。那么能极大提升剪枝效率，从而缩短计算时间。
 * 目前优化方式：
 * 1. 优先级排序，按邻居的个数和远近排序
 * 2. 当搜索最后两层的时候，只搜索有相邻邻居的节点
 * 3. 若果发现有能成五个或者能成活四的节点，直接返回此节点。不用浪费时间去计算其他节点了
 */

var role = require("./role.js");
var scorePoint = require("./score-point.js");
var score = require("./score.js");

var gen = function(board, deep) {
  
  var bestPoints = [];  //最优先考虑的点
  var neighbors = [];
  var nextNeighbors = [];
  for(var i=0;i<board.length;i++) {
    for(var j=0;j<board[i].length;j++) {
      if(board[i][j] == role.empty) {
        var _s = scorePoint(board, [i,j]);
        if(_s >= score.FIVE) {
          return [[i, j]];
        } else if(_s >= score.FOUR) {
          return [[i, j]];
        } else if(_s >= score.TWO) {
          bestPoints.push([i, j]);
        } else if(hasNeighbor(board, [i, j], 1, 1)) {
          neighbors.push([i, j]);
        } else if(deep >= 2 && hasNeighbor(board, [i, j], 2, 2)) {
          nextNeighbors.push([i, j]);
        }
      }
    }
  }
  return bestPoints.concat(neighbors.concat(nextNeighbors));
}

//有邻居
var hasNeighbor = function(board, point, distance, count) {
  var len = board.length;
  var startX = point[0]-distance;
  var endX = point[0]+distance;
  var startY = point[1]-distance;
  var endY = point[1]+distance;
  for(var i=startX;i<=endX;i++) {
    if(i<0||i>=len) continue;
    for(var j=startY;j<=endY;j++) {
      if(j<0||j>=len) continue;
      if(i==point[0] && j==point[1]) continue;
      if(board[i][j] != role.empty) {
        count --;
        if(count <= 0) return true;
      }
    }
  }
  return false;
}


module.exports = gen;
