// 10 أخطاء JavaScript بيقع فيها المبتدئين، والحل بتاع كل واحدة
// انسخ أي غلطة في الـ Console (F12) وشوف النتيجة بنفسك

// 1) "5" + 3 = "53"
// القيمة اللي جاية من input دايماً نص، و + مع نص بتلزق مش بتجمع
const price = "5";
const quantity = 3;
console.log(price + quantity);          // ❌ "53"
console.log(Number(price) + quantity);  // ✅ 8


// 2) == بتحوّل الأنواع قبل ما تقارن
console.log(0 == "");    // ❌ true
console.log(0 == "0");   // ❌ true
console.log("" == "0");  // false (مش منطقي مع اللي فوق!)
// ✅ === بتقارن القيمة والنوع
console.log(0 === "");   // false
console.log(0 === "0");  // false
console.log("" === "0"); // false


// 3) querySelector بيرجّع null
// السكريبت اشتغل قبل ما الزرار يتعمل في الصفحة
// ❌ <script src="app.js"></script>  جوه الـ head
// ✅ <script src="app.js" defer></script>  (defer: استنى لحد ما الصفحة تخلص)
// const btn = document.querySelector("#btn");
// btn.addEventListener("click", () => console.log("اتضغط ✅"));


// 4) map من غير return
const prices = [10, 20, 30];
console.log(prices.map((p) => { p * 2 }));  // ❌ [undefined, undefined, undefined]
console.log(prices.map((p) => p * 2));      // ✅ [20, 40, 60]  (من غير أقواس: الـ return أوتوماتيك)


// 5) نسيت await
async function getCity(name) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=1&language=ar`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results[0];
}

async function show() {
  const wrong = getCity("Cairo");
  console.log(wrong);       // ❌ Promise {<pending>}
  console.log(wrong.name);  // ❌ undefined

  const city = await getCity("Cairo");
  console.log(city.name);   // ✅ القاهرة
}
show();


// 6) var جوه loop
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var:", i), 1000);  // ❌ 3, 3, 3
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let:", j), 1000);  // ✅ 0, 1, 2  (let: نسخة جديدة في كل لفة)
}


// 7) نسخ object
const user = { name: "سارة", age: 25 };
const sameUser = user;           // ❌ ده مش نسخة، ده نفس الأوبجكت
sameUser.name = "علي";
console.log(user.name);          // "علي" 😱

const user2 = { name: "سارة", age: 25 };
const copy = { ...user2 };       // ✅ أوبجكت جديد
copy.name = "علي";
console.log(user2.name);         // "سارة"


// 8) sort للأرقام
const scores = [10, 1, 5, 100, 25];
console.log([...scores].sort());                 // ❌ [1, 10, 100, 25, 5]  (بترتّب كنصوص)
console.log([...scores].sort((a, b) => a - b));  // ✅ [1, 5, 10, 25, 100]


// 9) array فاضي بيعتبر true
const cart = [];
if (cart) console.log("❌ عندك منتجات في السلة 🛒");
if (cart.length > 0) console.log("عندك منتجات");
else console.log("✅ السلة فاضية");


// 10) 0.1 + 0.2
const total = 0.1 + 0.2;
console.log(total);                                     // ❌ 0.30000000000000004
console.log(total === 0.3);                             // ❌ false
console.log(total.toFixed(2));                          // ✅ "0.30" للعرض
console.log(Math.abs(total - 0.3) < Number.EPSILON);    // ✅ true للمقارنة
