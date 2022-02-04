(() => {
  // ModuleA.js
  console.log("I'm moduleA");
  var ModuleA_default = {
    a: 9999,
    fuck: true
  };

  // multipleSimpleDataEqual.js
  console.log(ModuleA_default.fuck);
  function isSimpleEqual_1() {
    if (arguments.length < 2)
      return false;
    var flag = true;
    for (var i = 0; i < arguments.length; i++) {
      for (var j = 0; j < arguments.length; j++) {
        if (arguments[i] !== arguments[j]) {
          flag = false;
          break;
        }
      }
    }
    return flag;
  }
  var result_1 = isSimpleEqual_1(1, 1, 1);
  console.log("result_1:", result_1);
  function isSimpleEqual_2() {
    let args = Array.from(arguments);
    args.reduce((prev, cur) => {
      console.log("prev:", prev);
      console.log("cur:", cur);
    });
  }
  var result_2 = isSimpleEqual_2(999, 1223123, true);
  console.log("result_2:", result_2);
})();
