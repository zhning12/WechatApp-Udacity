const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
};

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

Page({
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBackground: '',
    forecast: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  },
  getNow(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: '广州市'
      },
      success: res => {
        console.log(res.data.result);
        let result = res.data.result;
        let weather = result.now.weather;
        let temp = result.now.temp;
        console.log(temp, weather);
        let forecast = result.forecast;
        let nowHour = new Date().getHours();
        for (let i = 0; i < forecast.length; i++) {
          forecast[i].temp += '°';
          forecast[i].iconPath = `/images/${forecast[i].weather}-icon.png`;
          forecast[i].time = i + nowHour % 24 + '时';
        }
        this.setData({
          nowTemp: temp + '°',
          nowWeather: weatherMap[weather],
          nowWeatherBackground: `/images/${weather}-bg.png`,
          forecast: forecast
        });

        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: weatherColorMap[weather],
        });
      },
      complete: () => {
        callback && callback();
      }
    })
  },
  onLoad() {
    this.getNow();
  },

  onPullDownRefresh() {
    this.getNow(() => {
      wx.stopPullDownRefresh();
    })
  }
})