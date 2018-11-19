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

const QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

Page({
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBackground: '',
    hourlyWeather: [],
    todayDate: '',
    todayTemp: '',
    city: '广州市',
    locationAuthType: UNPROMPTED
  },
  getNow(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: this.data.city
      },
      success: res => {
        console.log(res.data.result);
        let result = res.data.result;
        this.setWeather(result);
        this.setHourlyWeather(result);
        this.setToday(result);
      },
      complete: () => {
        callback && callback();
      }
    })
  },
  onLoad() {
    this.qqmapsdk = new QQMapWX({
      key: 'IJKBZ-AK6KU-VRXVS-BDMN7-IE4O3-MKBH6'
    })
    wx.getSetting({
      success: res => {
        let auth = res.authSetting['scope.userLocation']
        this.setData({
          locationAuthType: auth ? AUTHORIZED : (auth === false) ? UNAUTHORIZED : UNPROMPTED
        })
        if(auth)
          this.getCityAndWeather();
        else
          this.getNow();
      },
      fail:()=>{
        this.getNow();
      }
    })
  },

  onPullDownRefresh() {
    this.getNow(() => {
      wx.stopPullDownRefresh();
    })
  },
  setWeather(result) {
    let weather = result.now.weather;
    let temp = result.now.temp;
    this.setData({
      nowTemp: temp + '°',
      nowWeather: weatherMap[weather],
      nowWeatherBackground: `/images/${weather}-bg.png`,
    });

    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    });
  },
  setHourlyWeather(result) {
    let forecast = result.forecast;
    let hourlyWeather = [];
    let nowHour = new Date().getHours();
    for (let i = 0; i < forecast.length; i++) {
      hourlyWeather.push({
        time: (3 * i + nowHour) % 24 + '时',
        temp: forecast[i].temp + '°',
        iconPath: `/images/${forecast[i].weather}-icon.png`
      });
    }
    hourlyWeather[0].time = '现在';
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },
  setToday(result) {
    let date = new Date();
    this.setData({
      todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
      todayDate: `${date.getFullYear()} - ${date.getMonth() + 1} - ${date.getDate()} 今天`
    })
  },
  onTapDayWeather() {
    wx.navigateTo({
      url: '/pages/list/list?city=' + this.data.city,
    })
  },
  onTapLocation() {
    if (this.data.locationAuthType === UNAUTHORIZED)
      wx.openSetting({
        success: res => {
          let auth = res.authSetting['scope.userLocation'];
          if (auth) {
            this.getCityAndWeather()
          }
        }
      });
    else
      this.getCityAndWeather();

  },
  getCityAndWeather() {
    wx.getLocation({
      success: res => {
        this.setData({
          locationAuthType: AUTHORIZED
        })
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            let city = res.result.address_component.city;
            this.setData({
              city: city
            })
            this.getNow();
          }
        })
      },
      fail: () => {
        this.setData({
          locationAuthType: UNAUTHORIZED
        })
      }
    })
  }
})

