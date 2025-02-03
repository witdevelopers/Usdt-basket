// Developer : Abhishek Pandey

const currency = {
  INR: { Sign: "₹", Value: 29410.28 },
  USD: { Sign: "$", Value: 392.29 },
  EUR: { Sign: "€", Value: 332.76 },
};

async function getConversionRates() {
  let IsSuccessful = false;

  let eth_usd = 0;
  let eth_eur = 0;
  let eth_inr = 0;

  await $.ajax({
    type: "GET",
    url: "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,INR",
    success: function (data) {
      IsSuccessful = true;

      eth_usd = data.USD;
      eth_eur = data.EUR;
      eth_inr = data.INR;
    },
    error: function (status, ex) {
      swal(ex);
    },
  });

  return new Promise((resolve, reject) => {
    if (IsSuccessful) {
      const data = {
        INR: eth_inr,
        USD: eth_usd,
        EUR: eth_eur,
      };
      sessionStorage.setItem("conversionRates", JSON.stringify(data));
      resolve(data);
    } else {
      const data = {
        INR: currency.INR.Value,
        USD: currency.USD.Value,
        EUR: currency.EUR.Value,
      };
      sessionStorage.setItem("conversionRates", JSON.stringify(data));
      reject(true);
    }
  });
}

function getConvertedValue(ethAmount) {
  var _data = JSON.parse(sessionStorage.getItem("conversionRates"));
  var _currency = sessionStorage.getItem("Currency");

  return currency[_currency].Sign + Math.round(ethAmount * _data[_currency]);
}

function CopyToClipboard(containerid) {
  if (window.getSelection) {
    if (window.getSelection().empty) {
      // Chrome
      window.getSelection().empty();
    } else if (window.getSelection().removeAllRanges) {
      // Firefox
      window.getSelection().removeAllRanges();
    }
  } else if (document.selection) {
    // IE?
    document.selection.empty();
  }

  if (document.selection) {
    var range = document.body.createTextRange();
    range.moveToElementText(document.getElementById(containerid));
    range.select().createTextRange();
    document.execCommand("copy");
  } else if (window.getSelection) {
    var range = document.createRange();
    range.selectNode(document.getElementById(containerid));
    window.getSelection().addRange(range);
    document.execCommand("copy");
  }

  toastr.success("Copied to clipboard!");
}

function createLine(containerId, el_Id1, el_Id2) {
  var el1 = document.getElementById(el_Id1);
  var el2 = document.getElementById(el_Id2);
  var off1 = getElementProperty(el1);
  var off2 = getElementProperty(el2);

  var dx1 = off1.left + off1.width / 2;
  var dy1 = off1.top + off1.height;

  var dx2 = off2.left + off2.width / 2;
  var dy2 = off2.top;

  $("#" + containerId).line(dx1, dy1, dx2, dy2, {
    zindex: 10000,
    color: "#aaa",
    stroke: "1",
    style: "solid",
    class: "line",
  });
}

function getElementProperty(el) {
  var dx = 0;
  var dy = 0;
  var width = el.offsetWidth | 0;
  var height = el.offsetHeight | 0;

  dx += el.offsetLeft;
  dy += el.offsetTop;

  return { top: dy, left: dx, width: width, height: height };
}

function toDateTime(secs) {
  var t = new Date(1970, 0, 1);
  t.setSeconds(secs);
  return t.toUTCString();
}
