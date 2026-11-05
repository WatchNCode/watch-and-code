// 1) نمسك العناصر اللي هنشتغل عليها
const form = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");
const message = document.querySelector("#message");
const weatherBox = document.querySelector("#weather");

// 2) نحوّل كود الطقس لوصف عربي وإيموجي
function getWeatherInfo(code) {
  if (code === 0) return { text: "سماء صافية", icon: "☀️" };
  if (code <= 3) return { text: "غائم جزئياً", icon: "⛅" };
  if (code <= 48) return { text: "شبورة", icon: "🌫️" };
  if (code <= 57) return { text: "رذاذ خفيف", icon: "🌦️" };
  if (code <= 67) return { text: "أمطار", icon: "🌧️" };
  if (code <= 77) return { text: "ثلج", icon: "❄️" };
  if (code <= 82) return { text: "زخات مطر", icon: "🌧️" };
  return { text: "عواصف رعدية", icon: "⛈️" };
}

// 3) نحوّل اسم المدينة لإحداثيات (Geocoding API)
async function getCity(name) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=ar`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.results) {
    throw new Error("مش لاقي المدينة دي، جرّب اسم تاني");
  }
  return data.results[0];
}

// 4) نجيب الطقس بالإحداثيات (Forecast API)
async function getWeather(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=auto&forecast_days=6`;
  const response = await fetch(url);
  return response.json();
}

// 5) نعرض البيانات في الصفحة
function showWeather(city, data) {
  const current = data.current;
  const info = getWeatherInfo(current.weather_code);

  document.querySelector("#city-name").textContent = `${city.name}، ${city.country}`;
  document.querySelector("#icon").textContent = info.icon;
  document.querySelector("#temp").textContent = `${Math.round(current.temperature_2m)}°`;
  document.querySelector("#description").textContent = info.text;
  document.querySelector("#humidity").textContent = `${current.relative_humidity_2m}%`;
  document.querySelector("#wind").textContent = `${Math.round(current.wind_speed_10m)} كم/س`;

  // الأيام الجاية: بنسيب النهارده ونعرض الخمسة اللي بعده
  const forecast = document.querySelector("#forecast");
  forecast.innerHTML = "";

  for (let i = 1; i < data.daily.time.length; i++) {
    const dayName = new Date(data.daily.time[i]).toLocaleDateString("ar-EG", { weekday: "short" });
    const dayInfo = getWeatherInfo(data.daily.weather_code[i]);
    const max = Math.round(data.daily.temperature_2m_max[i]);
    const min = Math.round(data.daily.temperature_2m_min[i]);

    forecast.innerHTML += `
      <div class="day">
        <div>${dayName}</div>
        <span class="day-icon">${dayInfo.icon}</span>
        <div>${max}° / ${min}°</div>
      </div>
    `;
  }

  weatherBox.classList.remove("hidden");
}

// 6) الدالة الرئيسية: بتربط كل حاجة ببعض
async function search(cityName) {
  message.textContent = "جاري التحميل... ⏳";
  weatherBox.classList.add("hidden");

  try {
    const city = await getCity(cityName);
    const data = await getWeather(city.latitude, city.longitude);
    showWeather(city, data);
    message.textContent = "";
    localStorage.setItem("lastCity", cityName);
  } catch (error) {
    message.textContent = error.message;
  }
}

// 7) لما المستخدم يدوس بحث أو Enter
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const cityName = cityInput.value.trim();
  if (cityName === "") {
    message.textContent = "اكتب اسم مدينة الأول 🙂";
    return;
  }
  search(cityName);
});

// 8) أول ما الصفحة تفتح: نعرض آخر مدينة اتبحث عنها (أو القاهرة)
search(localStorage.getItem("lastCity") || "القاهرة");
